
export function Song(id, title, source, ext_url = "", length = "", description = "", image = ".assets/gandalf.gif", stream_url = "") {
    this.id = id
    this.title = title
    this.source = source
    this.ext_url = ext_url
    this.length = length
    this.description = description
    this.image = image
    this.stream_url = stream_url
}

export const FAKE_SONGS = [
    new Song(1, "Set 1", "youtube"),
    new Song(2, "Set 2", "soundcloud"),
    // new Song(3, "Setlkjn 2" ,"./What Happens In One Minute.mp3" ),
    // new Song(4, "Setnn 2" ,"./What Happens In One Minute.mp3" ),
    // new Song(5, "Setkjn 2" ,"./What Happens In One Minute.mp3" ),
    // new Song(6, "Set 3","./Four Tet & Ben UFO - Mix for Hessle Audio  Rinse FM.mp3", "Ahahahaaha", "")
]


