// TODO redux store hooked up to actions that make API calls

const CardData = [
  {
    id: 1,
    label: 'Phase 1',
    type: 'card',
    elements: [
      {
        id: 2,
        label: 'Choose a lead maternity carer',
        tags: [],
        type: 'card',
        elements: [
          {
            id: 3,
            tags: [],
            type: 'richtext',
            label: 'This label is ignored',
            text: "<p>As soon as you know you're pregnant, you need to choose a lead maternity carer (LMC). Most LMCs are registered midwives, but they can also be obstetricians — doctors who specialise in pregnancy and childbirth — or family doctors who provide maternity care.</p><p>If you're eligible, you'll get free or subsidised maternity care unless you to choose a specialist as your LMC.</p>"
          },
          {
            id: 14,
            tags: ['boac_presentation::auxilary'],
            type: 'richtext',
            label: 'Who can get free or subsidised maternity care',
            text: "<p>You'll get access to free or subsidised maternity care if you, or your partner by de facto relationship, marriage or civil union, is:</p><ul><li>a New Zealand citizen or permanent resident</li><li>an Australian citizen or permanent resident who's lived, or intends to live, in New Zealand for 2 years or more</li><li>under 17 and your parent or guardian is eligible</li><li>a work visa holder who's eligible to be here for 2 years or more</li><li>an interim visa holder who was eligible just before you got the interim visa</li><li>a New Zealand Aid Programme student</li><li>a commonwealth scholarship student</li><li>a refugee or protected person, or in the process of applying or appealing for refugee or protection status</li><li>a victim of people trafficking.</li></ul>"
          },
          {
            id: 15,
            tags: ['boac_presentation::auxilary'],
            type: 'richtext',
            label: 'What an LMC does',
            text: '<p>Your LMC will:</p><ul><li>provide care throughout your pregnancy</li><li>provide information about choices you can make, eg where to give birth</li><li>be with you when you give birth</li><li>provide care to you and your baby for 4-6 weeks after the birth</li><li>refer you or your baby to a specialist, if needed.</li></ul>'
          },
          {
            id: 16,
            tags: [],
            type: 'url',
            label: 'This label is ignored',
            url: 'http://www.findyourmidwife.co.nz/',
            linkLabel: 'Find your midwife'
          }
        ]
      },
      {
        id: 4,
        label: 'Decide what screening to have',
        tags: [],
        type: 'card',
        elements: [{
          id: 5,
          tags: [],
          type: 'richtext',
          text: "<p>You can decide to get screening and tests to check the health of you and your baby. You may need to pay for some tests. Talk to your lead maternity carer to help you to decide what kind of screening you should have.</p><h4>What screening you can get</h4><h5>First free antenatal blood test</h5><p>The first test you'll be offered is a free antenatal blood test.</p>"
        }]
      }
    ]
  },
  {
    id: 6,
    label: 'Phase 2',
    type: 'card',
    elements: [
      {
        id: 7,
        label: 'Check if you can get Working for Families',
        tags: [],
        type: 'card',
        elements: [{
          id: 8,
          tags: [],
          type: 'richtext',
          text: "<p>Working for Families is a payment for parents to help with the costs of raising children. There are four types of Working for Families Tax Credits. You may qualify for more than one type of tax credit.</p><h4>Family Tax Credits</h4><h5>What it is</h5><p>Family tax credits are available for families with dependent children. It's a payment of up to $101 per child a week.</p>"
        }]
      },
      {
        id: 9,
        label: 'Check if you can get help with costs from Work and Income',
        tags: [],
        type: 'card',
        elements: [{
          id: 10,
          tags: [],
          type: 'richtext',
          text: '<p>Work and Income may be able to help during your pregnancy and after your baby is born.</p><h4>Help with housing</h4><h5>What it is</h5><p>The Accommodation Supplement is a weekly payment which helps people with their rent, board or the cost of owning a home.</p>'
        }]
      }
    ]
  },
  {
    id: 11,
    label: 'Phase 3',
    type: 'card',
    elements: [
      {
        id: 12,
        label: 'Get a car seat ready',
        tags: [],
        type: 'card',
        elements: [{
          id: 13,
          tags: [],
          type: 'richtext',
          text: '<p>Before you can take your baby home from the hospital, you need to install the correct car seat.</p><h4>Choosing the right car seat</h4><p>It is recommended that your baby use a rear-facing car seat until they are 2 years old, or until they have outgrown their car seat. Make sure you have your car seat ready for when you leave the hospital after birth and prepare yourself with some important factors below.</p><ul><li>Rent or buy a baby car seat before your baby is born, as baby needs to be protected on every journey.</li><li>Try the car seat in your vehicle before you buy or hire it and follow the instruction manual to install it. The car seat must be fitted correctly for safety.</li><li>Always put your baby’s car seat rear-facing in the back seat with baby looking out the back window.</li><li>Never put your baby’s car seat in the front of a vehicle if it has an airbag. Airbags inflate with enough force to seriously injure a baby.</li><li>Use a car seat every time your baby is in a vehicle. Every journey on the road is a risk.</li><li>Don’t leave your baby asleep in their car seat if you are not in the vehicle. Some babies have breathing difficulties if their head falls forward.</li><li>Keep your baby in a rear-facing seat until they are around 2 years old, or have outgrown their car seat.</li><li>Check the label on the seat and move to another rear facing car seat if necessary, to keep your baby rear-facing longer.</li><li>A car seat must be appropriate for the weight and size of the baby.</li></ul>'
        }]
      }
    ]
  }
]

export default CardData
