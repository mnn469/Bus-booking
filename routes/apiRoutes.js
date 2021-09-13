const express = require('express')
const router = express.Router()
const db = require('../models')
const bus = require('../models/bus')
const valid_routes = require('../models/valid_routes')
const category = require('../models/category')
const specs = require('../models/specs')
const bookings = require('../models/bookings')
const bus_date_mapping = require('../models/bus_date_mapping')
const { Op } = require('sequelize')

router.get("/category/", (req, res)=>{

    db.category.findAll().then(category => res.send(category))

})

router.get('/category/:id', (req, res)=>{
    db.category.findAll({

        where: {
            id: req.params.id
        }

    }).then(category => res.send(category))
})

router.post('/category', (req, res)=>{
    db.category.create({

        name: req.body.name,
    
    }).then(submitedCategory => res.send(submitedCategory))
})

router.get('/bus/', async(req, res)=>{
    const catId = req.query.catId;
    const from = req.query.from;
    const to = req.query.to;
    const date_ = req.query.Date;
    const stri = req.query.stri;

    const searchQuery = {
        $like : Op.like
    }
    const filter = {
        where: {},
        include: [{
            model: db.category,
        }, {
            model : db.bus_date_mapping,
        }, {
            model : db.specs,
        }, {
            model : db.valid_routes,
        }],
    };
    if (catId) {
        filter.where.categoryId = catId;
    }
    if(date_){
        filter.where.date = new Date(date_)
    }
    if (req.query.stri) {
        filter.where = {
            [Op.or] : [
                {name: {[Op.iLike]: `%${stri}%`}},
                {'$category.name$' : {[Op.iLike]: `%${stri}%`}}
            ]
        }
    }
    if (req.query.from) {
        filter.where = {
            [Op.or] : [
                {source:{[Op.iLike]: `%${from}%`}},
                {'$valid_routes.From$' : {[Op.iLike]: `%${from}%`}}
            ]
        }
    }

    if (req.query.to) {
        filter.where = {
            [Op.or] : [
                {destination: {[Op.iLike]: `%${to}%`}},
                {'$valid_routes.To$' : {[Op.iLike]: `%${to}%`}}
            ]
        }
    }
    console.log(filter);
    let list = await db.bus.findAll(filter);
    res.send(list);  
})

router.post('/bus', async(req, res)=> {
    const bus_details = await db.bus.create({
        // pId: req.body.pId,
        name: req.body.name,
        source: req.body.source,
        destination: req.body.destination,
        seats: req.body.seats,
        categoryId: req.body.categoryId
    })
    const arr1 = []
    req.body.valid_routes.forEach((element, index) => {
        arr1.push({
            From: bus_details.source,
            To: element.To,
            duration: element.duration,
            price: element.price,
            busId: bus_details.id
        })        
    });

    const routes_data = await db.valid_routes.bulkCreate(arr1, {returning : true})

    const arr2 = []
    req.body.specs.forEach((element, index) => {
        arr2.push({

            name: element.name,
            busId: bus_details.id

        })
    })

    const spec_data = await db.specs.bulkCreate(arr2, {returning : true})

    res.send(bus_details)
})

router.delete('/delete/:id', (req, res)=>{
    db.bus.destroy({
        where:{
            id: req.params.id
        }
    }).then(() => res.send('success'))
})

router.put('/bus/:id', async(req, res)=> {
    const bus_update = await db.bus.update({
        name: req.body.name,
        source: req.body.source,
        destination: req.body.destination,
        seats: req.body.seats,
        categoryId: req.body.categoryId
    }, {
        where: {
            id: req.params.id
        }
    })

    const routes_data = await db.valid_routes.findAll({
        where : {busId: req.params.id}
    })

    const specs_data = await db.specs.findAll({
        where: {busId: req.params.id}
    })

    let flag = 0;
    const ar1 = []
    const ar2 = []
    const ar3 = []

    req.body.valid_routes.forEach((element, index) => {
        routes_data.forEach((elt, idx) => {
            if(element.id === elt.id){
                flag = 1
            }
        })

        if(element.method === "Update" && flag === 1){
            ar1.push({
                valid_routesId: element.id,
                From : element.From,
                To: element.To,
                duration: element.duration,
                price: element.price,
                busId: req.params.id
            })
        }

        if(element.method === "Update" && flag === 0){
            ar2.push({
                From : element.From,
                To: element.To,
                duration: element.duration,
                price: element.price,
                busId: req.params.id
            })
        }

        if(element.method === "Delete" && flag === 1){
            ar3.push({
                valid_routesId: element.id,
                From : element.From,
                To: element.To,
                duration: element.duration,
                price: element.price,
                busId: req.params.id
            })
        }

    })

    await db.valid_routes.bulkCreate(ar2, {returning : true})

    for (let i = 0; i < ar1.length; i++){
        await db.valid_routes.update({
            From : ar1[i].From,
            To: ar1[i].To,
            duration: ar1[i].duration,
            price: ar1[i].price,
            busId: ar1[i].busId
        }, {
            where : {id : ar1[i].valid_routesId}
        })
    }

    for(let j = 0; j < ar3.length; j++){
        await db.valid_routes.destroy({
                    where : {id : ar3[j].valid_routesId}
                })
                

    }

    const ar4 = []
    const ar5 = []
    const ar6 = []
    let flag_ = 0;

    req.body.specs.forEach((element, index) => {
        specs_data.forEach((elt, idx) => {
            if(element.id === elt.id){
                flag_ = 1
            }
        })

        if(element.method === "Update" && flag_ === 1){
            ar4.push({
                specId: element.id,
                name: element.name,
                busId: req.params.id
            })
        }

        if(element.method === "Update" && flag_ === 0){
            ar5.push({
                name: element.name,
                busId: req.params.id
            })
        }

        if(element.method === "Delete" && flag_ === 1){
            ar6.push({
                specId: element.id,
                name: element.name,
                busId: req.params.id
            })
        }

    })

    await db.specs.bulkCreate(ar5, {returning : true})

    for (let i = 0; i < ar4.length; i++){
        await db.specs.update({
            name : ar4[i].name,
            busId: ar4[i].busId
        }, {
            where : {id : ar4[i].specId}
        })
    }

    for(let j = 0; j < ar6.length; j++){
        await db.specs.destroy({
                    where : {id : ar6[j].specId}
                })
    }

    const updated_data = await db.bus.findOne({
        where: {id : req.params.id},
            include : [{
                model : db.category,
            }, {
                model : db.valid_routes,
            }, {
                model : db.specs,
            }]
        
    })
    res.send(updated_data)
})

router.post('/checkout', async(req, res)=> {
    const booking_data = await db.bookings.findAll({
        where: {}
    })
    const array_ = [];

    const bus_data = await db.bus.findOne({
        where: {id : req.body.busId}
    })

    if(booking_data){
        booking_data.forEach((element, index) => {
            array_.push({
                bookingId: element.id
            })       
        })

        for (let i = 0; i < array_.length; i++){
            await db.bookings.update({
                flag : 0
            }, {
                where : {id : array_[i].bookingId}
            })
        }
        const bus_mapping_data = await db.bus_date_mapping.findOne({
            where:{
                busId : req.body.busId,
                date: new Date(req.body.date)
            }
        })
        console.log(bus_mapping_data)

        if(bus_mapping_data && req.body.ticket > bus_mapping_data.available_seats){
            return res.send("Enough tickets not available")
        }


        else if(bus_mapping_data && bus_mapping_data.available_seats > 0){
            await db.bus_date_mapping.update({
                available_seats: bus_mapping_data.available_seats - req.body.ticket
            }, {
                where: {id : bus_mapping_data.id}
            })

            const try1 = await db.bookings.create({
                busId : req.body.busId,
                valid_routesId: req.body.valid_routesId,
                bus_date_mappingId: bus_mapping_data.id
        
            })
        

            const booking_final = await db.bookings.findOne({
                where : {id : try1.id},
                include : [{
                    model : db.bus,
                }, {
                    model : db.bus_date_mapping,
                }, {
                    model : db.valid_routes,
                }]
            })
        
            return res.send(booking_final)

        }
        else if(bus_mapping_data && bus_mapping_data.available_seats === 0){
            console.log("No seats available")
            res.send("NO seats left")
        }
        else if(!bus_mapping_data){
            const bus_map_data = await db.bus_date_mapping.create({
                date: new Date(req.body.date),
                available_seats: bus_data.seats - req.body.ticket,
                busId: req.body.busId
            })

            await db.bookings.create({
                busId : req.body.busId,
                valid_routesId: req.body.valid_routesId,
                bus_date_mappingId: bus_map_data.id
        
            })

            const booking_final = await db.bookings.findOne({
                where : {bus_date_mappingId : bus_map_data.id},
                include : [{
                    model : db.bus,
                }, {
                    model : db.bus_date_mapping,
                }, {
                    model : db.valid_routes,
                }]
            })
        
            return res.send(booking_final)
    
        }
    }

    if(!booking_data){

        const imp = await db.bus_date_mapping.create({
            date: new Date(req.body.date),
            available_seats: bus_data.seats - req.body.ticket,
            busId: req.body.busId
        })

        await db.bookings.create({
            busId : req.body.busId,
            valid_routesId: req.body.valid_routesId,
            bus_date_mappingId : imp.id
    
        })

        const booking_final = await db.bookings.findOne({
            where : {bus_date_mappingId : imp.id},
            include : [{
                model : db.bus,
            }, {
                model : db.bus_date_mapping,
            }, {
                model : db.valid_routes,
            }]
        })
    
        return res.send(booking_final)
    }
})

router.get('/bookingHistory/', async(req, res)=>{
    const history = await db.bookings.findAll({
        where: {},
            include : [{
                model : db.bus,
            }, {
                model : db.valid_routes,
            }]
        
    })
    return res.send(history)
})

router.delete('/delete/bookingHistory/:id', (req, res)=>{
    db.bookings.destroy({
        where:{
            id: req.params.id
        }
    }).then(() => res.send('success'))
})

module.exports = router ;