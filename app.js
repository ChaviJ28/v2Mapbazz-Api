let express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    bcrypt = require("bcrypt"),
    cors = require("cors"),
    mongoose = require("mongoose"),
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require("./app.js"), //error with ./swagger.json
    path = require("path");


require("dotenv").config();
var port = process.env.PORT;
app.use(bodyparser.json({ limit: "50mb" }));
app.use(
    bodyparser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);
app.use(cors());

mongoose.connect("mongodb://localhost:27017/maubazz", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, "uploads")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/error.html"));
});


const middleware = require("./middleware/index.js");
app.use(middleware.checkApiKey);

const authRoutes = require("./routes/auth.js");
const imageRoutes = require("./routes/image.js");
const adminRoutes = require("./routes/admin.js");

app.use("/api", authRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/admin", adminRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, (req, res) => {
    console.log("Node on " + port + ", " + process.env.NODE_ENV + " environment");
});