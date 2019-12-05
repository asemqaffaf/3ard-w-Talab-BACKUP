/**
 * description: this is a  micro service for posts and services
 *  200 OK
 *  201 successfully create an object
    202 Accepted 
    204 No Content
    400 Bad Request
    404 Not Found
 */
const express = require('express') // express js
const cors = require('cors')
const router = express.Router()
router.use(cors())   ///middleware for network
router.use(express.json())  // middleware as well but this will make all responses with json type !
const postsData = require('../models/postsDatabase')


/*<===========================this method to fetch all post data ===========================*/
router.get('/data', async (request, response) => {
    try {
        let data = await postsData.find()
        response.status(200).json(data)
    } catch (err) {
        response.status(500).json({ message: err.message })
    }
})
/*<=========================== END.  fetch all   func.===========================>*/

/*<=====================this path will take the root path======================>*/
/*<===========================this method to search and sort categories all post  ===========================*/
router.get('/', async (request, response) => {
    var arr = []
    if (Object.keys(request.query).length !== 0) {
        if (request.query.q != null) {
            arr = await searchFunc(request.query.q)
        }
        if (request.query.q === undefined) {
            arr = await categoriesFunc(request.query)
        }
    }
    arr = (arr.length === 0 ? 'no request data found' : arr)
    response.json(arr)
})
/*<=========================== START. sort in Category has been applied in following func.===========================>*/
/*  params:
        postCategories
        location
        name
        additionalInfo 
        BIG n * 4
*/
async function categoriesFunc(name) {
    let Data = await postsData.find(name)
    return Data
}
/*<=========================== END. sort in Category  func.===========================>*/
/*<=========================== START. search operation has been applied in following func.===========================>*/
/*  params:
        {q:''}
*/
async function searchFunc(target) {
    // console.log('target', target) // {postCategories: '' }  {location: ''}name additionalInfo etc.
    let arr = (target ? [] : 'no data found')
    let data = postsData.find()
    await data.then(DATA => {
        if (target)
            DATA.map((post) => {
                Object.values(post._doc).map((nested) => {
                    if (typeof nested === 'string' && nested != null && target != null)
                        if (nested.toLowerCase().includes(target.toLowerCase())) {
                            // console.log(post._doc)
                            arr.push(post._doc)
                        }

                })
            })
    })
        .catch(err => {
            return { message: err.message }
        })
    return arr
}
/*<=========================== END. Search  func.===========================>*/

/*<=========================== START.get Posts API has been applied in following func.===========================>*/
/*  params: {sellerID: ''} 
            {buyerOffers: ''}  */
router.get('/getOffers', (async (request, response) => {
    // console.log(request.query.buyerOffers)
    response.json(request.query.sellerID != null ?
        await sellerOffers(request.query.sellerID) :
        await buyerOffers(request.query.buyerOffers)
    )
})) /// asem@qaffaf.com
async function sellerOffers(sellerID) {
    let arr = [] /// Asem or hello
    if (sellerID != null){
    let data = postsData.find()
    await data.then(DATA => {
        DATA.map((post) => {
                if (post._doc.sellerID === sellerID) {
                    Object.keys(post._doc).map(key => {
                        if (post._doc[key].price != null) {
                            arr.push(post._doc.imgUrl)
                            arr.push({ id: post._id , [key]: post._doc[key].price })
                        }
                    })
                }
        })
        arr = (arr.length === 0 ? [] : arr)
    })
        .catch(err => {
            return { message: err.message }
        })
    }
    return arr
}
async function buyerOffers(buyerName) {
    let arr = [] //buyer889111
    let data = postsData.find()
    await data.then((DATA) => {
        DATA.map(post => {
            if (post._doc[buyerName] != null) {
                // console.log(post._id)
                // arr.push({id:post._doc._id,imgUrl:post._doc.imgUrl})
                arr.push(post._doc.imgUrl)
                arr.push(post._doc[buyerName])
            }
        })
        arr = (arr.length === 0 ? [] : arr)
    })
        .catch(err => {
            return { message: err.message }
        })

    return arr
}
/*<=========================== END.get Posts API   func.===========================>*/

/*<=========================== START.add new Posts API has been applied in following func.===========================>*/
router.post('/postAdvertisement', async (request, response) => {
    console.log(request.body)
    let { sellerID, postCategories, location, name, additionalInfo, imgUrl } = request.body
    if (sellerID != null && postCategories != null && location != null && name != null && additionalInfo != null && imgUrl != null) {
        try {
            await postsData.create(request.body, (err, doc) => {
                if (err) {
                    response.status(400).json({ message: err.message })
                } else
                    response.status(201).json(doc)
            })
        }
        catch (err) {
            response.status(500).json(err)
        }
    }
})

/*<=========================== END. add new Posts  func.===========================>*/
/*<=========================== START.add new offer to particular post   func.===========================>*/
router.get('/postOffers', async (request, response) => {
    console.log(request.query)
    let { id } = request.query
    let offerMaker = Object.keys(request.query)[1]
    let offerPrice = request.query[offerMaker]
    // console.log(offerPrice)
    let newObj = { [offerMaker]: { price: offerPrice, date: Date(Date.now()), status: "pending" , id  } }
    try {
        await postsData.findByIdAndUpdate(id, newObj, (err, doc) => {
            if (err) { response.status(400).json({ message: err.message }) }
            else response.status(201).json(doc)

        })
    }
    catch (err) {
        response.status(500).json({ message: err.message })
    }

})
/*<=========================== END. add new Posts  func.===========================>*/
/*<=========================== START. DELETE a Post  func.===========================>*/
let IdsForDeleteArray = []
router.delete('/:id', async (request, response) => {
    let test = request.params.id
    IdsForDeleteArray.push(test)
    if (IdsForDeleteArray.length !== 0) {
        DeleteTimer
    }
    response.json("it will have been deleted at 12 AM")
})
const DeleteAtSpecificTime = async (id) => {
    let output = null
    try {
        await postsData.findByIdAndDelete(id, (err, doc) => {
            if (err) { output = { message: err.message } }
            else { 
                output = { deletion: doc } 
                IdsForDeleteArray.shift()
             }
        })
    }
    catch (error) {
        output = { message: error.message }
    }
    return output
}
const DeleteTimer = setInterval( () => {
    var date = new Date();
    if (date.getHours() === 0 && date.getMinutes() === 34) {
        IdsForDeleteArray.forEach(async id=>{
            await  DeleteAtSpecificTime(id)
        console.log("deleted items",await DeleteAtSpecificTime())
        })
    }
}, 10000)

/*<=========================== END. DELETE a Post  func.===========================>*/

module.exports = router