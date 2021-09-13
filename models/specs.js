module.exports = (sequelize, DataTypes)=>{
    const specs = sequelize.define("specs", {
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
