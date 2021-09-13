module.exports = (sequelize, DataTypes)=>{
    const category = sequelize.define("category", {
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

    category.associate = function(models){
        category.hasMany(models.bus, {
            foreignKey: "categoryId"
        });
}


    

    return category;
}