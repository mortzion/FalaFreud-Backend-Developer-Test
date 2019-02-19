let config = {
    port: process.env.PORT || 5000,
    db: "mongodb://admin:notadmin123@ds147118.mlab.com:47118/falafreud-test-db", 
    testDb: "mongodb://admin:admin123@ds119930.mlab.com:19930/falafreud-test-test-db"
};

module.exports = config;