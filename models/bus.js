module.exports = (sequelize, DataTypes)=>{
    const bus = sequelize.define("bus", {
        // busId: {
        //     type: DataTypes.INTEGER,
        //     allowNull : false,
        //     primaryKey : true
        // },
        name: {
            type: DataTypes.TEXT,
            allowNull : false
        },
        source: {
            type: DataTypes.TEXT,
            allowNull : false
        },
        destination: {
            type: DataTypes.TEXT,
            allowNull : false
        },
        seats : {
            type: DataTypes.INTEGER,
            allowNull : false
        }
    });

    bus.associate = function(models){
        bus.hasMany(models.valid_routes, {
            foreignKey: "busId"
        });

    bus.hasMany(models.specs, {
        foreignKey: "busId"

    });

    bus.belongsTo(models.category, {
        foreignKey : "categoryId"
    });

    bus.hasMany(models.bus_date_mapping, {
        foreignKey : "busId"
    })
    
}


    

    return bus;
}