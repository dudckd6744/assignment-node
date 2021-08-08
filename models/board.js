const Sequelize = require('sequelize');

class Board extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            title: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
            content: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            like: { 
                type: Sequelize.INTEGER,
                defaultValue:0,
                allowNull: false,
            },
            isLike: { 
                type: Sequelize.BOOLEAN,
                defaultValue:false,
                allowNull: false, 
            },
        }, {
            sequelize,
            timestamps: true, // createAt, updateAt 자동 생성
            underscored: false, // sequelize에서 _ 사용할지 말지 ex) createAt -> create_at
            paranoid: true, // deleteAt을 생성 (삭제한 날짜)
            modelName: 'Board', // modelName - javascript에서 쓰인다.
            tableName: 'boards', // tableName - SQL에서 쓰이며, modelName의 소문자로 하고, 복수형으로 짓는다.
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Board.belongsTo(db.User);
    }
};

module.exports = Board;