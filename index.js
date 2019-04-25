import app from './app'

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port " + server.address().port);
});
