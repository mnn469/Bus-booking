module.exports = (sequelize, DataTypes)=>{
    const category = sequelize.define("category", {
        name: {
            type: DataTypes.TEXT,
            allowNull : false
        }
    });

    category.associate = function(models){
        category.hasMany(models.bus, {
            foreignKey: "categoryId"
        });
}


    

    return category;
}
