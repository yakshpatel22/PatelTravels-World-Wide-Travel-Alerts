const schema = `
type Query {
  project1_setup: Results
  alerts: [Alert]
  alertsforregion(region: String): [Alert]
  alertsforsubregion(subregion: String): [Alert]
  regions: [String]
  subregions: [String]
  countries: [String]
  advisories: [Advisory]
  travellers: [String]
  alertsfortravellers(travellername: String): [Advisory]
  
}
type Results {
  results: String
}
type Alert {
  country: String
  name: String
  text: String
  date: String
  region: String
  subregion: String
}
type Advisory {
  travellername: String
  name: String
  date: String
  text: String
}
type Mutation {
  addadvisory(travellername: String, name: String): Advisory
}
`;

export { schema };
