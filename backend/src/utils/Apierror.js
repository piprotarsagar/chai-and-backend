class Apierror extends Error{

    constructor(statuscode , message="something went wrong" , error=[] , stack ){
                
                //super means this must be overwrite(here we want thaat message must be overwrite that's why we add inside this)
                super(message),
                this.statuscode = statuscode,
                this.message = message,
                this.error = error,
                //here we have to read nodee documentation to learn data and success field, wwhich is by default given by node
                this.success = false,
                this.dataa = null

                if (stack){
                    this.stack = stack
                }

                else{
                    Error.captureStackTrace(this, this.constructor)
                }
    }


}

export {  Apierror  }