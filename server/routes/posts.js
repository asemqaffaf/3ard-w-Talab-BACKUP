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
        if (request.query.q !== undefined) {
            arr = await searchFunc(request.query.q)
        }
        if (request.query.q === undefined) {
            arr =await categoriesFunc(request.query)
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
    await getAllData.then(DATA => {
        if (target)
            DATA.map((post) => {
                Object.values(post._doc).map((nested) => {
                    if (typeof nested === 'string' && nested !== undefined && target !== undefined)
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
    console.log(request.query.buyerOffers)
    response.json(request.query.sellerID !== undefined ?
        await sellerOffers(request.query.sellerID) :
        await buyerOffers(request.query.buyerOffers)
    )
})) /// asem@qaffaf.com
const getAllData = new Promise((resolve, reject) => {
    try {
        resolve(postsData.find())
    }
    catch (err) {
        reject({ message: err.message })
    }

})
async function sellerOffers(sellerID) {
    var arr = [] /// Asem or hello
    await getAllData.then(DATA => {
        DATA.map((post) => {
            if (sellerID !== undefined)
                if (post._doc.sellerID === sellerID) {
                    Object.keys(post._doc).map(key => {
                        if (post._doc[key].price !== undefined) {
                            arr.push({ id: post._id })
                            arr.push(post._doc.imgUrl)
                            arr.push({ [key]: post._doc[key].price })
                        }
                    })
                }
        })
        arr = (arr.length === 0 ? 'no request data found' : arr)
    })
        .catch(err => {
            return { message: err.message }
        })
    return arr
}
async function buyerOffers(buyerName) {
    let arr = [] //buyer889111
    await getAllData.then((DATA) => {
        DATA.map(post => {
            if (post._doc[buyerName] !== undefined) {
                arr.push(post._doc.imgUrl)
                arr.push(post._doc[buyerName])
            }
        })
        arr = (arr.length === 0 ? 'no request data found' : arr)
    })
        .catch(err => {
            return { message: err.message }
        })

    return arr
}
/*<=========================== END.get Posts API   func.===========================>*/

/*<=========================== START.add new Posts API has been applied in following func.===========================>*/
router.post('/postAdvertisement', async (request, response) => {
    // console.log(request.body)
    let { sellerID, postCategories, location, name, additionalInfo, imgUrl } = request.body
    if (sellerID !== undefined && postCategories !== undefined && location !== undefined && name !== undefined && additionalInfo !== undefined && imgUrl !== undefined) {
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
router.patch('/postOffers', async (request, response) => {
    let { id } = request.query
    let offerMaker = Object.keys(request.query)[1]
    let offerPrice = request.query[offerMaker]
    // console.log(offerPrice)
    let newObj = { [offerMaker]: { price: offerPrice, date: Date(Date.now()) } }
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
router.delete('/:id', async (request, response) => {
    try {
        await postsData.findByIdAndDelete(request.params.id, (err, doc) => {
            if (err) { response.status(404).json({ message: err.message }) }
            else { response.status(202).json({ deletion: doc }) }
        })
    }
    catch (error) {
        response.status(500).json({ message: error.message })
    }
})

/*<=========================== END. DELETE a Post  func.===========================>*/

// router.post('/upload', (req, res) => {
//     console.log('wait for the whole post to be submitted ...')
//     console.log(req.body)
// })

// data = {
//     sellerID: "Asem",
//     postCategories: "car",
//     location: 'Amman',
//     name: "BMW",
//     additionalInfo: '520i',
//     imgUrl: 'https://images.summitmedia-digital.com/topgear/images/2018/07/31/BMW-520d1.jpg',
//     buyerOne: {
//         price: '20k',
//         date: Date(Date.now())
//     },
//     buyerTwo: {
//         price: '18k',
//         date: Date(Date.now())
//     },
//     buyerThree: {
//         price: '21k',
//         date: Date(Date.now())
//     },
//     buyerFour: {
//         price: '15k',
//         date: Date(Date.now())
//     }
// }

// router.get('/ASEM', async (request, response) => {
//     // let test = await postsData.find()
//     try {
//         await postsData.create(data, (err, doc) => {
//             if (err) {
//                 response.status(400).json({ message: err })
//             } else
//                 response.status(201).json(doc)
//         })
//     }
//     catch (err) {
//         response.status(500).json(err)
//     }
// })
module.exports = router