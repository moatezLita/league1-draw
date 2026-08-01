/**
 * Palmarès du championnat de Tunisie.
 *
 * Source : Wikipédia (fr), « Championnat de Tunisie de football ». Ces données
 * sont historiques et parfois discutées d'une source à l'autre : elles sont
 * regroupées ici, dans un seul fichier, précisément pour qu'une correction ne
 * demande de toucher à rien d'autre.
 *
 * `id` renvoie à un club de `teams.ts` quand il évolue encore en LP1 — c'est ce
 * qui permet d'afficher son écusson. Les clubs disparus ou relégués n'en ont
 * pas, et c'est normal.
 */
export interface TitleHolder {
  name: string;
  titles: number;
  /** identifiant dans teams.ts, si le club est encore en Ligue 1 */
  id?: string;
}

export const TITLES: TitleHolder[] = [
  { name: "Espérance Sportive de Tunis", titles: 34, id: "est" },
  { name: "Club Africain", titles: 14, id: "ca" },
  { name: "Étoile Sportive du Sahel", titles: 11, id: "ess" },
  { name: "Racing Club de Tunis", titles: 9 },
  { name: "Club Sportif Sfaxien", titles: 8, id: "css" },
  { name: "Club Athlétique Bizertin", titles: 4, id: "cab" },
  { name: "Stade Tunisien", titles: 4, id: "st" },
  { name: "CS Hammam Lif", titles: 4, id: "cshl" },
  { name: "Italia de Tunis", titles: 4 },
  { name: "Sfax Railway Sport", titles: 3 },
  { name: "Union Sportive Tunisienne", titles: 3 },
  { name: "Stade Gaulois", titles: 3 },
  { name: "Sporting Club de Tunis", titles: 2 },
  { name: "Sporting de Ferryville", titles: 2 },
  { name: "JS Kairouanaise", titles: 1 },
  { name: "CS Gabésien", titles: 1 },
  { name: "Savoia de La Goulette", titles: 1 },
  { name: "Avant-Garde de Tunis", titles: 1 },
];

export interface Champion {
  season: string;
  name: string;
  id?: string;
}

/** Les 25 dernières saisons répertoriées. */
export const CHAMPIONS: Champion[] = [
  { season: "2024-2025", name: "Espérance de Tunis", id: "est" },
  { season: "2023-2024", name: "Espérance de Tunis", id: "est" },
  { season: "2022-2023", name: "Étoile du Sahel", id: "ess" },
  { season: "2021-2022", name: "Espérance de Tunis", id: "est" },
  { season: "2020-2021", name: "Espérance de Tunis", id: "est" },
  { season: "2019-2020", name: "Espérance de Tunis", id: "est" },
  { season: "2018-2019", name: "Espérance de Tunis", id: "est" },
  { season: "2017-2018", name: "Espérance de Tunis", id: "est" },
  { season: "2016-2017", name: "Espérance de Tunis", id: "est" },
  { season: "2015-2016", name: "Étoile du Sahel", id: "ess" },
  { season: "2014-2015", name: "Club Africain", id: "ca" },
  { season: "2013-2014", name: "Espérance de Tunis", id: "est" },
  { season: "2012-2013", name: "Club Sportif Sfaxien", id: "css" },
  { season: "2011-2012", name: "Espérance de Tunis", id: "est" },
  { season: "2010-2011", name: "Espérance de Tunis", id: "est" },
  { season: "2009-2010", name: "Espérance de Tunis", id: "est" },
  { season: "2008-2009", name: "Espérance de Tunis", id: "est" },
  { season: "2007-2008", name: "Club Africain", id: "ca" },
  { season: "2006-2007", name: "Étoile du Sahel", id: "ess" },
  { season: "2005-2006", name: "Espérance de Tunis", id: "est" },
  { season: "2004-2005", name: "Club Sportif Sfaxien", id: "css" },
  { season: "2003-2004", name: "Espérance de Tunis", id: "est" },
  { season: "2002-2003", name: "Espérance de Tunis", id: "est" },
  { season: "2001-2002", name: "Espérance de Tunis", id: "est" },
  { season: "2000-2001", name: "Espérance de Tunis", id: "est" },
];
