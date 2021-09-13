module.exports = (sequelize, DataTypes)=>{
    const specs = sequelize.define("specs", {
        // busId: {
        //     type: DataTypes.INTEGER,
        //     allowNull : false,
        //     primaryKey : true
        // },
        name: {
            type: DataTypes.TEXT,
            allowNull : false
        }
    });

    specs.associate = function(models){
        specs.belongsTo(models.bus, {
            foreignKey: "busId"
        });
}


    

    return specs;
}