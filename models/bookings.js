module.exports = (sequelize, DataTypes)=>{
    const bookings = sequelize.define("bookings", {
    
        flag: {
            type: DataTypes.INTEGER,
            defaultValue : 1

        }
    });


    bookings.associate = function(models){
        bookings.belongsTo(models.bus, {
            foreignKey: "busId"
        });

        bookings.belongsTo(models.valid_routes, {
            foreignKey : "valid_routesId"
        })

        bookings.belongsTo(models.bus_date_mapping, {
            foreignKey : "bus_date_mappingId"
        })

    }

    return bookings;
}