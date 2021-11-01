const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hikaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('sb_tours');
        const sliderCollection = database.collection('sliders');
        const serviceCollection = database.collection('services');
        const tourCollection = database.collection('tours');
        const hotelCollection = database.collection('hotels');
        const tourBookingCollection = database.collection('tour_booking');


        // POST Slider API
        app.post('/sliders', async (req, res) => {
            const result = await sliderCollection.insertOne(req.body);
            res.json(result);
        });

        //GET Slider API
        app.get('/sliders', async (req, res) => {
            const cursor = sliderCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let sliders;
            const count = await cursor.count();

            if (page) {
                sliders = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                sliders = await cursor.toArray();
            }
            res.send({
                count,
                sliders
            });
        });

        // Edit Slider API
        app.get('/slider/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const slider = await sliderCollection.findOne(query);
            res.send(slider);
        })

        //UPDATE API
        app.put('/slider/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateSlider = {
                $set: req.body
            };
            //console.log(updateSlider);
            const result = await sliderCollection.updateOne(filter, updateSlider, options);
            res.json(result)
        })

        // Delete Slider API
        app.delete('/sliders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await sliderCollection.deleteOne(query);
            res.json(result);
        });

        // =====================================================
        //     services
        // ====================================================

        // POST Service API
        app.post('/services', async (req, res) => {
            const result = await serviceCollection.insertOne(req.body);
            res.json(result);
        });

        //GET Service API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let services;
            const count = await cursor.count();

            if (page) {
                services = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                services = await cursor.toArray();
            }
            res.send({
                count,
                services
            });
        });

        // Edit service API
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //UPDATE API
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateService = {
                $set: req.body
            };
            const result = await serviceCollection.updateOne(filter, updateService, options);
            res.json(result)
        })

        // Delete service API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        });

        // =====================================================
        //     tours
        // ====================================================

        // POST Tour API
        app.post('/tours', async (req, res) => {
            const result = await tourCollection.insertOne(req.body);
            res.json(result);
        });

        //GET tour API
        app.get('/tours', async (req, res) => {
            const cursor = tourCollection.find({});
            const query = req.query;
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let tours;
            const count = await cursor.count();

            if (page) {
                tours = await cursor.skip(page * size).limit(size).toArray();
            } else if (query) {
                const cursor = tourCollection.find(query);
                tours = await cursor.toArray();
            }
            else {
                tours = await cursor.toArray();
            }
            res.send({
                count,
                tours
            });
        });


        // /GET Category Tour

        app.get('/tour-categories', async (req, res) => {
            const query = req.query;
            const cursor = tourCollection.find(query);
            const tours = await cursor.toArray();
            res.send(tours);
        });

        // Edit tour API
        app.get('/tour/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tour = await tourCollection.findOne(query);
            res.send(tour);
        })

        //UPDATE tour API
        app.put('/tour/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateTour = {
                $set: req.body
            };
            const result = await tourCollection.updateOne(filter, updateTour, options);
            res.json(result)
        })

        // Delete tour API
        app.delete('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tourCollection.deleteOne(query);
            res.json(result);
        });


        // =====================================================
        //     hotel
        // ====================================================

        // POST hotel API
        app.post('/hotels', async (req, res) => {
            const result = await hotelCollection.insertOne(req.body);
            res.json(result);
        });

        //GET hotel API
        app.get('/hotels', async (req, res) => {
            const cursor = hotelCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let hotels;
            const count = await cursor.count();

            if (page) {
                hotels = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                hotels = await cursor.toArray();
            }
            res.send({
                count,
                hotels
            });
        });

        // Edit hotel API
        app.get('/hotel/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const hotel = await hotelCollection.findOne(query);
            res.send(hotel);
        })

        //UPDATE hotel API
        app.put('/hotel/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateHotel = {
                $set: req.body
            };
            const result = await hotelCollection.updateOne(filter, updateHotel, options);
            res.json(result)
        })

        // Delete hotel API
        app.delete('/hotels/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await hotelCollection.deleteOne(query);
            res.json(result);
        });

        // =====================================================
        //     booking
        // ====================================================

        // POST Tour Booking API
        app.post('/tour/booking', async (req, res) => {
            const result = await tourBookingCollection.insertOne(req.body);
            res.json(result);
        });

        //GET User Orders API
        app.get('/my-orders', async (req, res) => {
            const cursor = tourBookingCollection.find(req.query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // Edit order API
        app.get('/my-order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await tourBookingCollection.findOne(query);
            res.send(order);
        })

        //UPDATE User Order API
        app.put('/my-order/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateOrder = {
                $set: req.body
            };
            const result = await tourBookingCollection.updateOne(filter, updateOrder, options);
            res.json(result)

        })

        // Delete hotel API
        app.delete('/my-orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tourBookingCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('SB Tour server is running');
});

app.listen(port, () => {
    console.log('SB Server running at port', port);
})