module.exports = (sequelize, DataTypes)=>{
    const valid_routes = sequelize.define("valid_routes", {
        From: {
            type: DataTypes.TEXT,
            allowNull : false
        },
        To: {
            type: DataTypes.TEXT,
            allowNull : false
        },
        duration: {
            type: DataTypes.TEXT,
            allowNull : false
        },
        price : {
            type: DataTypes.INTEGER,
            allowNull : false
        }
    });

    valid_routes.associate = function(models){
        valid_routes.belongsTo(models.bus, {
            foreignKey: "busId"
        });
}

    return valid_routes;

    
}
