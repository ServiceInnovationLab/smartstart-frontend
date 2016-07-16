// TODO redux store hooked up to actions that make API calls

const CardData = [
  {
    id: 1,
    title: 'Phase 1',
    cards: [
      {
        id: 1,
        title: 'Find a lead maternity carer (LMC)',
        text: "<p>As soon as you know you're pregnant you need to choose an LMC. Most LMCs are registered midwives, but they can also be doctors who provide maternity care. Many people qualify for free or subsidised maternity care.</p><h4>Choosing an LMC</h4><p>You can usually choose to have either a midwife or an obstetrician (a doctor who specialises in pregnancy and childbirth) as your LMC. Midwife services are usually free, but you'll have to pay for a specialist doctor.</p>",
        order: 0
      },
      {
        id: 2,
        title: 'Decide what screening to have',
        text: "<p>You can decide to get screening and tests to check the health of you and your baby. You may need to pay for some tests. Talk to your lead maternity carer to help you to decide what kind of screening you should have.</p><h4>What screening you can get</h4><h5>First free antenatal blood test</h5><p>The first test you'll be offered is a free antenatal blood test.</p>",
        order: 1
      }
    ]
  },
  {
    id: 2,
    title: 'Phase 2',
    cards: [
      {
        id: 3,
        title: 'Check if you can get Working for Families',
        text: "<p>Working for Families is a payment for parents to help with the costs of raising children. There are four types of Working for Families Tax Credits. You may qualify for more than one type of tax credit.</p><h4>Family Tax Credits</h4><h5>What it is</h5><p>Family tax credits are available for families with dependent children. It's a payment of up to $101 per child a week.</p>",
        order: 0
      },
      {
        id: 4,
        title: 'Check if you can get help with costs from Work and Income',
        text: '<p>Work and Income may be able to help during your pregnancy and after your baby is born.</p><h4>Help with housing</h4><h5>What it is</h5><p>The Accommodation Supplement is a weekly payment which helps people with their rent, board or the cost of owning a home.</p>',
        order: 1
      }
    ]
  }
]

export default CardData
