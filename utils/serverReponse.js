export const ServerResponse = ( statusCode, data, message, req, res) =>{


    console.log(statusCode)
    console.log("I am inside server response function");
       
  return  res.status(statusCode).json(data, message)

}