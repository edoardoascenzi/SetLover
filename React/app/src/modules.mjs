
export function Song(id, title, music, description = "", image = "./gandalf.gif") {
    this.id = id
    this.title = title
    this.music = music
    this.description = description
    this.image = image
}

export const FAKE_SONGS = [
    new Song(1, "Set 1", "", "Channel 1", ""),
    new Song(2, "Set 2", "", "", ""),
    // new Song(3, "Setlkjn 2" ,"./What Happens In One Minute.mp3" ),
    // new Song(4, "Setnn 2" ,"./What Happens In One Minute.mp3" ),
    // new Song(5, "Setkjn 2" ,"./What Happens In One Minute.mp3" ),
    // new Song(6, "Set 3","./Four Tet & Ben UFO - Mix for Hessle Audio  Rinse FM.mp3", "Ahahahaaha", "")
]


