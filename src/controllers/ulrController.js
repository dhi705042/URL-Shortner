const urlModel = require("../models/urlModel.js")
const redis = require("redis");

const { promisify } = require("util");

const redisClient = redis.createClient(
    15827,
    "redis-15827.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("B319nmG7lHoNE5u3sDgBsQGsnWLYPzOk", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

// # 1. - Check whether the body is empty
const isValidReqBody = function (reqBody) {
    return Object.keys(reqBody).length > 0;
}

// # 2. - Check whether the value is empty or blank
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false;   //Checks whether the value is null or undefined
    if (typeof value === 'string' && value.trim().length === 0) return false;// Checks whether the value is an empty string
    return true
}

const createShortUrl = async function (req, res) {
    try {

        if (!isValidReqBody(req.body)) {
            return res.status(400).send({ status: false, message: "Please provide details to action further", });
        }

        const { longUrl } = req.body // destructure the longUrl from req.body.longUrl

        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, message: "Please Provide URL to shortern", });
        }

        // const regex = (/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i)
        const regex = (/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)
        if (!regex.test(longUrl)) {
            res.status(400).send({ status: false, msg: "the URL is invalid, please provided correct URL" })
        } else {

            let cachedData = await GET_ASYNC(`${longUrl}`)

            //client.get(longUrl, async function (err, data) {
            //   if (err) throw err;
            if (cachedData) {
                console.log("data from cache")
                res.status(200).send({ status: true, data: JSON.parse(cachedData) })
            } else {
                const checkLongUrlDuplicate = await urlModel.findOne({ longUrl }).select({ _id: 0, updatedAt: 0, createdAt: 0, __v: 0 })

                if (checkLongUrlDuplicate) {
                    res.status(200).send({ status: true, data: checkLongUrlDuplicate })
                } else {
                    const baseUrl = 'http://localhost:3000'
                    //const urlCode = shortid.generate().toLowerCase()

                    const length = 6
                    let urlCode = '';
                    const characters = 'abcdefghijklmnopqrstuvwxyz';
                    const charactersLength = characters.length;
                    for (let i = 0; i < length; i++) {
                        urlCode += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }

                    const shortUrl = baseUrl + '/' + urlCode

                    let urldata = { urlCode, longUrl, shortUrl }

                    const savingsUrlData = await urlModel.create(urldata)
                    await SET_ASYNC(`${longUrl}`, JSON.stringify(urldata))
                    //client.setex(longUrl, 3600, JSON.stringify(urldata))
                    console.log("data from DB")
                    res.status(200).send({ status: true, data: urldata })
                }
            }
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}


const urlRedirection = async function (req, res) {
    try {
        const urlCodeFromPath = req.params.urlcode


        // client.get(urlCodeFromPath, async function (err, data){
        // if (err) throw err;
        let cachedData = await GET_ASYNC(`${urlCodeFromPath}`)
        if (cachedData) {
            console.log("data pulled from cache")
            res.status(302).redirect(JSON.parse(cachedData));

        } else {
            const urlDataFound = await urlModel.findOne({ urlCode: urlCodeFromPath })
            if (urlDataFound) {
                console.log("data pulled from DB")
                await SET_ASYNC(`${urlCodeFromPath}`, JSON.stringify(urlDataFound.longUrl))
                res.status(302).redirect(urlDataFound.longUrl)
            } else {
                return res.status(404).send('No URL Found')
            }
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


//     const urlFound = await urlModel.findOne({urlCode: req.params.urlcode})
//     if (urlFound){
//         return res.status(302).redirect(urlFound.longUrl)
//     } else {
//         return res.status(404).send('No URL Found')
//     }
// }

module.exports.createShortUrl = createShortUrl
module.exports.urlRedirection = urlRedirection