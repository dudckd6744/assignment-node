let err = {
    exist :{
        statusCode : 404,
        message: "이미 해당 유저가 존재합니다."
    },
    empty :{
        statusCode : 400,
        message: "필수입력 사항이 비어있습니다."
    },
}

module.exports ={
    exist_message(){
        result = {};
        result["statusCode"] = err.exist.statusCode
        result["message"] = err.exist.message
        return result;
    },

    empty_message(){
        result = {};
        result["statusCode"] = err.empty.statusCode
        result["message"] = err.empty.message
        return result;
    }

}