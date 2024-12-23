// models/models.go

package models

type Skola struct {
	Skola              string   `json:"Skola"`
	EMail              string   `json:"EMail"`
	BrojTelefona       string   `json:"BrojTelefona"`
	BrojFaksa          *string  `json:"BrojFaksa"`
	Web                *string  `json:"Web"`
	Zupanija           string   `json:"Zupanija"`
	SkolaProgramRokId  int      `json:"SkolaProgramRokId"`
	VrstaOsnivaca      string   `json:"VrstaOsnivaca"`
	Program            string   `json:"Program"`
	VrstaPrograma      string   `json:"VrstaPrograma"`
	VrstaProgramaId    int      `json:"VrstaProgramaId"`
	SkolaId            int      `json:"SkolaId"`
	Kvota              int      `json:"Kvota"`
	ParalelnaKvota     int      `json:"ParalelnaKvota"`
	Trajanje           int      `json:"Trajanje"`
	Prag               *int     `json:"Prag"`
	Adresa             string   `json:"Adresa"`
	Mjesto             string   `json:"Mjesto"`
	Lat                *float64 `json:"Lat"`
	Lng                *float64 `json:"Lng"`
	Naziv              string   `json:"Naziv"`
	Id                 int      `json:"Id"`
	ImaDodatnuProvjeru *bool    `json:"ImaDodatnuProvjeru"`
}

type SugestijeRequest struct {
	Interesi string   `json:"interesi"`
	Programi []string `json:"programi"`
}

type SugestijeResponse struct {
	Objasnjenje string   `json:"objasnjenje"`
	Programi    []string `json:"programi"`
}

type Recommendation struct {
	Program string `json:"program"`
}
