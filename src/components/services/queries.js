const dataset = '"35de6bf8-b254-4025-89f5-da9eb6adf9a0"' // TODO bring from config
const resultColumns = `
  "PROVIDER_NAME",
  "ORGANISATION_PURPOSE",
  "SERVICE_NAME",
  "SERVICE_DETAIL",
  "PHYSICAL_ADDRESS",
  "LATITUDE",
  "LONGITUDE",
  "PROVIDER_WEBSITE_1",
  "PUBLISHED_CONTACT_EMAIL_1",
  "PUBLISHED_PHONE_1",
  "PROVIDER_CONTACT_AVAILABILITY"`
const removeNullResults = `
  "LATITUDE" IS NOT NULL
    AND
  "LONGITUDE" IS NOT NULL
    AND
  "LATITUDE" != '0'
    AND
  "LONGITUDE" != '0'`
const orderBy = `
  ORDER BY
    "LONGITUDE"`

// using select distinct (and not trying to return catergory data) means that
// duplicate entries (across returned values) will be dropped

export const PARENTING_SUPPORT_QUERY = encodeURI(
  `SELECT DISTINCT ${resultColumns} from ${dataset} WHERE ${removeNullResults} AND
    (
        "LEVEL_2_CATEGORY" LIKE '%Babies and Toddlers 0-5%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Family / Whanau Support%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Parenting - Skills and Support%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Helplines - Parenting%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Support Groups - Parents%'
    ) AND (
        LOWER("SERVICE_DETAIL") NOT LIKE '%child%care%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%toys%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%kindergarten%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%play%group%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%students%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%social%work%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%older people%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%adolescen%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%counselling%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%therap%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%mediat%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%legal%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%school%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%budget%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%mental health%'
      AND
        LOWER("SERVICE_NAME") NOT LIKE '%teen%'
      AND
        LOWER("SERVICE_NAME") NOT LIKE '%play%'
    ) AND (
        LOWER("SERVICE_DETAIL") LIKE '%parent%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%parent%'
    )
    ${orderBy}`
)

export const EARLY_ED_QUERY = encodeURI(
  `SELECT DISTINCT ${resultColumns} from ${dataset} WHERE ${removeNullResults} AND
    (
        LOWER("SERVICE_DETAIL") NOT LIKE '%after%school%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%after%school%'
    ) AND (
      "LEVEL_2_CATEGORY" LIKE '%Preschool / Early Childhood Education%'
    )
    ${orderBy}`
)

export const BREAST_FEEDING_QUERY = encodeURI(
  `SELECT DISTINCT ${resultColumns} from ${dataset} WHERE ${removeNullResults} AND
    (
        LOWER("SERVICE_DETAIL") LIKE '%breast%fe%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%breast%fe%'
      OR
        LOWER("SERVICE_DETAIL") LIKE '%lactation%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Breast Feeding Support%'
    )
    ${orderBy}`
)

export const ANTENATEL_QUERY = encodeURI(
  `SELECT DISTINCT ${resultColumns} from ${dataset} WHERE ${removeNullResults} AND
    (
        LOWER("SERVICE_DETAIL") LIKE '%ante%natal%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%ante%natal%'
    ) AND (
        LOWER("PROVIDER_NAME") NOT LIKE '%postnatal%'
    ) AND (
        "LEVEL_2_CATEGORY" LIKE '%Pregnancy and Childbirth%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Well Child Health (Tamariki Ora)%'
      OR
        LOWER("PROVIDER_NAME") LIKE '%plunket%'
    )
    ${orderBy}`
)

export const MISCARRIAGE_QUERY = encodeURI(
  `SELECT DISTINCT ${resultColumns} from ${dataset} WHERE ${removeNullResults} AND
    (
        LOWER("SERVICE_DETAIL") LIKE '%miscarriage%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%miscarriage%'
      OR
        LOWER("SERVICE_DETAIL") LIKE '%still%birth%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%still%birth%'
      OR
        LOWER("SERVICE_DETAIL") LIKE '%still%born%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%still%born%'
    ) OR (
        LOWER("SERVICE_DETAIL") LIKE '%pregnan%'
      AND
        (
            LOWER("SERVICE_DETAIL") LIKE '%grief%'
          OR
            LOWER("SERVICE_DETAIL") LIKE '%loss%'
        )
    )
    ${orderBy}`
)


export const MENTAL_HEALTH_QUERY = encodeURI(
  `SELECT DISTINCT ${resultColumns} from ${dataset} WHERE ${removeNullResults} AND
    (
        LOWER("SERVICE_DETAIL") LIKE '%natal%depression%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%natal%depression%'
      OR
        LOWER("SERVICE_DETAIL") LIKE '% pnd %'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '% pnd %'
      OR
        LOWER("SERVICE_DETAIL") LIKE '%natal%distress%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%natal%distress%'
    )
    ${orderBy}`
)


export const MENTAL_HEALTH_QUERY2 = encodeURI(
  `SELECT DISTINCT ${resultColumns} from ${dataset} WHERE ${removeNullResults} AND
    (
        LOWER("SERVICE_DETAIL") NOT LIKE '%eating disorder%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%eating disorder%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%sexual%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%sexual%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%youth%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%youth%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%HIV%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%HIV%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%teen%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%teen%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%earthquake%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%earthquake%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%older pe%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%older pe%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%workplace%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%workplace%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%gender%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%gender%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%homicide%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%homicide%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%budget%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%budget%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%work and income%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%work and income%'
    ) AND (
        "LEVEL_2_CATEGORY" LIKE '%Counselling%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Depression%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Disaster Recovery%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Anxiety Problems%'
    )
    ${orderBy}`
)


export const MENTAL_HEALTH_QUERY3 = encodeURI(
  `SELECT DISTINCT ${resultColumns} from ${dataset} WHERE ${removeNullResults} AND
    (
        LOWER("SERVICE_DETAIL") NOT LIKE '%eating%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%eating%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%sexual%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%sexual%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%youth%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%youth%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%teen%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%teen%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%older%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%older%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%workplace%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%workplace%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%gender%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%gender%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%course%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%course%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%budget%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%budget%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%work and income%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%work and income%'
    ) AND (
        LOWER("SERVICE_DETAIL") LIKE '%mental%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%mental%'
      OR
        LOWER("SERVICE_DETAIL") LIKE '%depression%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%depression%'
      OR
        LOWER("SERVICE_DETAIL") LIKE '%distress%'
      OR
        LOWER("ORGANISATION_PURPOSE") LIKE '%distress%'
    ) AND (
        "LEVEL_2_CATEGORY" LIKE '%Counselling%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Depression%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Anxiety Problems%'
    )
    ${orderBy}`
)


export const BUDGETING_QUERY = encodeURI(
  `SELECT DISTINCT ${resultColumns} from ${dataset} WHERE ${removeNullResults} AND
    (
        "LEVEL_2_CATEGORY" LIKE '%Other budgeting services%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Financial Assistance%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%Financial mentors%'
      OR
        "LEVEL_2_CATEGORY" LIKE '%MoneyMates%'
    ) AND (
        LOWER("SERVICE_DETAIL") NOT LIKE '%student%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%student%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%education%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%education%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%job%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%job%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%older people%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%older people%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%awards%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%awards%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%superannuation%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%superannuation%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%supergold%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%supergold%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%retirement%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%retirement%'
      AND
        LOWER("SERVICE_DETAIL") NOT LIKE '%pension%'
      AND
        LOWER("ORGANISATION_PURPOSE") NOT LIKE '%pension%'
      AND
        LOWER("PROVIDER_NAME") NOT LIKE 'work and income%'
    )
    ${orderBy}`
)

export const WELL_CHILD_QUERY = encodeURI(
  `SELECT DISTINCT ${resultColumns} from ${dataset} WHERE ${removeNullResults} AND
    (
        "LEVEL_2_CATEGORY" LIKE '%Well Child Health (Tamariki Ora)%'
    )
    ${orderBy}`
)
