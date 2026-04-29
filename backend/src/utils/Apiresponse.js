class Apiresponse {

    construtor(statuscode, data , message="seccess"){
       this.statuscode = statuscode,
       this.data = data,
       this.message = message,
       this.success = statuscode < 400 

    }

}

export {Apiresponse}
