const Sequelize = require('sequelize');

class Like extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            boardId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false, // createAt, updateAt 자동 생성
            underscored: false, // sequelize에서 _ 사용할지 말지 ex) createAt -> create_at
            modelName: 'Like', // modelName - javascript에서 쓰인다.
            tableName: 'likes', // tableName - SQL에서 쓰이며, modelName의 소문자로 하고, 복수형으로 짓는다.
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        // db.Like.belongsTo(db.User);
        // db.Like.belongsTo(db.Board);
    }
};

module.exports = Like;