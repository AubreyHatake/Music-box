User.findAll({
    attributes: { exclude: ['password'] },
    order: [['name', 'ASC']],
  });
   User.create({ 
    name:"specialK",
    email:"khole@test.test",
    password:"keta-4-life"
    })
    .then((user) => {
      console.log(user.dataValues)

      Review.create({
        album_id: "1234",
        user_id: user.dataValues.user_id,
        review: "this is a review"
      })
      .then((review) => {
        console.log(review)
      })
    })
    
