if(process.env.NODE_ENV === 'production'){
   module.exports = {mongoURI: 'mongodb://<nsiddiqui25>:<taqwaa8033>@ds117749.mlab.com:17749/ideajot2122'}
} else {
   module.exports = {mongoURI: 'mongodb://localhost/ideajot-dev'}
}