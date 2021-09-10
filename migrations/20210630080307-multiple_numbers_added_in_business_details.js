module.exports = {
  async up(db, client) {
    await db.collection('businesses').updateMany(
      { telephone: { $exists: true }},
      [{
        $set: {
          numbers: [{
            type: 'primary',
            number: '$telephone'
          }],
        },
      }]
    )
  },

  async down(db, client) {
    // Not possible to rollback updateMany
  }
};