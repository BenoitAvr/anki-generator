import Database from 'better-sqlite3'
import JSZip from 'jszip'
import { createHash } from 'crypto'

function fieldChecksum(str: string): number {
  const hex = createHash('sha1').update(str, 'utf8').digest('hex')
  return parseInt(hex.slice(0, 8), 16)
}

function guid(): string {
  return Math.random().toString(36).slice(2, 13)
}

export async function generateApkg(
  cards: { front: string; back: string }[],
  deckName: string
): Promise<Buffer> {
  const now = Math.floor(Date.now() / 1000)
  const modelId = 1607392319
  const deckId = 1607392320

  const db = new Database(':memory:')

  db.exec(`
    CREATE TABLE col (
      id INTEGER PRIMARY KEY,
      crt INTEGER NOT NULL,
      mod INTEGER NOT NULL,
      scm INTEGER NOT NULL,
      ver INTEGER NOT NULL,
      dty INTEGER NOT NULL,
      usn INTEGER NOT NULL,
      ls INTEGER NOT NULL,
      conf TEXT NOT NULL,
      models TEXT NOT NULL,
      decks TEXT NOT NULL,
      dconf TEXT NOT NULL,
      tags TEXT NOT NULL
    );
    CREATE TABLE notes (
      id INTEGER PRIMARY KEY,
      guid TEXT NOT NULL,
      mid INTEGER NOT NULL,
      mod INTEGER NOT NULL,
      usn INTEGER NOT NULL,
      tags TEXT NOT NULL,
      flds TEXT NOT NULL,
      sfld INTEGER NOT NULL,
      csum INTEGER NOT NULL,
      flags INTEGER NOT NULL,
      data TEXT NOT NULL
    );
    CREATE TABLE cards (
      id INTEGER PRIMARY KEY,
      nid INTEGER NOT NULL,
      did INTEGER NOT NULL,
      ord INTEGER NOT NULL,
      mod INTEGER NOT NULL,
      usn INTEGER NOT NULL,
      type INTEGER NOT NULL,
      queue INTEGER NOT NULL,
      due INTEGER NOT NULL,
      ivl INTEGER NOT NULL,
      factor INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      lapses INTEGER NOT NULL,
      left INTEGER NOT NULL,
      odue INTEGER NOT NULL,
      odid INTEGER NOT NULL,
      flags INTEGER NOT NULL,
      data TEXT NOT NULL
    );
    CREATE TABLE revlog (
      id INTEGER PRIMARY KEY,
      cid INTEGER NOT NULL,
      usn INTEGER NOT NULL,
      ease INTEGER NOT NULL,
      ivl INTEGER NOT NULL,
      lastIvl INTEGER NOT NULL,
      factor INTEGER NOT NULL,
      time INTEGER NOT NULL,
      type INTEGER NOT NULL
    );
    CREATE TABLE graves (
      usn INTEGER NOT NULL,
      oid INTEGER NOT NULL,
      type INTEGER NOT NULL
    );
    CREATE INDEX ix_notes_usn ON notes (usn);
    CREATE INDEX ix_cards_usn ON cards (usn);
    CREATE INDEX ix_revlog_usn ON revlog (usn);
    CREATE INDEX ix_cards_nid ON cards (nid);
    CREATE INDEX ix_cards_sched ON cards (did, queue, due);
    CREATE INDEX ix_revlog_cid ON revlog (cid);
    CREATE INDEX ix_notes_csum ON notes (csum);
  `)

  const conf = JSON.stringify({
    nextPos: 1,
    estTimes: true,
    activeDecks: [1],
    sortType: 'noteFld',
    timeLim: 0,
    sortBackwards: false,
    addToCur: true,
    dayLearnFirst: false,
    newBury: true,
    newSpread: 0,
    dueCounts: true,
    curModel: String(modelId),
    curDeck: 1,
  })

  const models = JSON.stringify({
    [modelId]: {
      id: modelId,
      name: 'Basic',
      type: 0,
      mod: now,
      usn: 0,
      sortf: 0,
      did: null,
      tmpls: [
        {
          name: 'Card 1',
          ord: 0,
          qfmt: '{{Front}}',
          afmt: '{{FrontSide}}<hr id=answer>{{Back}}',
          bqfmt: '',
          bafmt: '',
          did: null,
          bfont: '',
          bsize: 0,
        },
      ],
      flds: [
        {
          name: 'Front',
          ord: 0,
          sticky: false,
          rtl: false,
          font: 'Arial',
          size: 20,
          media: [],
        },
        {
          name: 'Back',
          ord: 1,
          sticky: false,
          rtl: false,
          font: 'Arial',
          size: 20,
          media: [],
        },
      ],
      css: '.card { font-family: arial; font-size: 20px; text-align: center; color: black; background-color: white; }',
      latexPre:
        '\\documentclass[12pt]{article}\n\\special{papersize=3in,5in}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amssymb,amsmath}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0in}\n\\begin{document}\n',
      latexPost: '\\end{document}',
      tags: [],
      vers: [],
    },
  })

  const decks = JSON.stringify({
    1: {
      id: 1,
      name: 'Default',
      desc: '',
      extendRev: 50,
      usn: 0,
      collapsed: false,
      browserCollapsed: false,
      newToday: [0, 0],
      timeToday: [0, 0],
      revToday: [0, 0],
      lrnToday: [0, 0],
      mod: now,
      conf: 1,
      dyn: 0,
    },
    [deckId]: {
      id: deckId,
      name: deckName,
      desc: '',
      extendRev: 50,
      usn: 0,
      collapsed: false,
      browserCollapsed: false,
      newToday: [0, 0],
      timeToday: [0, 0],
      revToday: [0, 0],
      lrnToday: [0, 0],
      mod: now,
      conf: 1,
      dyn: 0,
    },
  })

  const dconf = JSON.stringify({
    1: {
      id: 1,
      name: 'Default',
      replayq: true,
      lapse: {
        leechFails: 8,
        minInt: 1,
        delays: [10],
        leechAction: 0,
        mult: 0,
      },
      rev: {
        perDay: 100,
        ease4: 1.3,
        fuzz: 0.05,
        minSpace: 1,
        ivlFct: 1,
        maxIvl: 36500,
        bury: true,
        hardFactor: 1.2,
      },
      timer: 0,
      maxTaken: 60,
      usn: 0,
      new: {
        perDay: 20,
        delays: [1, 10],
        separate: true,
        ints: [1, 4, 7],
        initialFactor: 2500,
        bury: true,
        order: 1,
      },
      mod: now,
      autoplay: true,
    },
  })

  db.prepare(
    'INSERT INTO col VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
  ).run(1, now, now, now, 11, 0, -1, 0, conf, models, decks, dconf, '{}')

  const insertNote = db.prepare(
    'INSERT INTO notes VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  )
  const insertCard = db.prepare(
    'INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  )

  const insertMany = db.transaction(
    (items: { front: string; back: string }[]) => {
      items.forEach((card, i) => {
        const noteId = now * 1000 + i
        const cardId = now * 1000 + i + 100000
        const flds = `${card.front}\x1f${card.back}`
        const csum = fieldChecksum(card.front)

        insertNote.run(
          noteId,
          guid(),
          modelId,
          now,
          -1,
          '',
          flds,
          card.front,
          csum,
          0,
          ''
        )
        insertCard.run(
          cardId,
          noteId,
          deckId,
          0,
          now,
          -1,
          0,
          0,
          i + 1,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          ''
        )
      })
    }
  )

  insertMany(cards)

  const dbBuffer = db.serialize()
  db.close()

  const zip = new JSZip()
  zip.file('collection.anki2', dbBuffer)
  zip.file('media', '{}')

  const apkgBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  return apkgBuffer
}
