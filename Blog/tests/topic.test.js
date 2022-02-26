const request = require('supertest')
const app = require('../src/app')
const Topic = require('../src/models/topic')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    topicOne,
    topicTwo,
    topicThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create topic for user', async () => {
    const response = await request(app)
        .post('/topics')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "discription": "Coocking"
        })
        .expect(201)
   
    
})

test('Should fetch user topics', async () => {
    const response = await request(app)
        .get('/topic/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
  
})


