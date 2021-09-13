module.exports = (sequelize, DataTypes)=>{
    const bus_date_mapping = sequelize.define("bus_date_mapping", {
        // busId: {
        //     type: DataTypes.INTEGER,
        //     allowNull : false,
        //     primaryKey : true
        // },
        date: {
            type: DataTypes.DATE
            
        },
        available_seats : {
            type: DataTypes.INTEGER

        }
    });


    bus_date_mapping.associate = function(models){
        bus_date_mapping.belongsTo(models.bus, {
            foreignKey: "busId"
        });
    }

    return bus_date_mapping;
}