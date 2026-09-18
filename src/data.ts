import { SiteContent } from './types';

export const INITIAL_SITE_CONTENT: SiteContent = {
  brandName: 'Kirjastus Saagu Valgus',
  brandTagline: 'Vaimuliku kirjanduse, elumuutvate tunnistuste ja evangeelsete trükiste kirjastamine Eestis.',
  contactEmail: 'info@saaguvalgus.eu',
  heroBadge: 'Saagu Valgus – Tõde, mis teeb vabaks',
  heroTitle: 'Valgus või',
  heroHighlight: 'pimedus?',
  heroDescription: 'Elame maailmas, kus pakutakse sadu vaimseid teid ja «isiklikke tõdesid». Mis on tegelik tõde? Kuidas leida elav rahu, vabaneda hirmudest ning saada kindlus igavesest elust?',
  
  // The exact 3 background Bible verses requested by user
  coreVerses: [
    {
      ref: 'Johannese 3:16',
      text: 'Sest nõnda on Jumal maailma armastanud, et ta oma ainusündinud Poja on andnud, et ükski, kes temasse usub, ei hukkuks, vaid et tal oleks igavene elu.',
      theme: 'Jumala armastus'
    },
    {
      ref: '2. Kuningate 17:17',
      text: 'Ja nad lasksid oma poegi ja tütreid tulest läbi käia; nad küsitlesid ennustajaid ja toimetasid nõidust; nad müüsid endid kurja tegema Issanda silmis, vihastuseks temale.',
      theme: 'Hoiatus okultismi eest'
    },
    {
      ref: 'Joeli 3:5',
      text: 'Ja sünnib, et igaüks, kes hüüab appi Issanda nime, pääseb.',
      theme: 'Pääste tõotus'
    }
  ],

  // The 3 rhetorical questions from the tract
  tractQuestions: [
    {
      id: 'igauele-oma-jumal',
      number: 1,
      question: 'Igaühele «oma jumal» – tõde või vale?',
      summary: 'Tänapäeval väidetakse sageli, et iga tee viib samale mäetipule ja igaüks võib ise oma jumala valida. Kuid kas tõde saab olla korraga vasturääkiv?',
      tractQuote: '«Paljud usuvad, et igal inimesel on oma tõde. Kuid Jeesus ei öelnud, et Ta on üks paljudest alternatiividest. Ta ütles: Mina olen tee ja tõde ja elu; ükski ei saa Isa juurde muidu kui minu kaudu.»',
      biblicalAnswer: 'Jumal on loonud universumi ja inimese. Tõde ei ole subjektiivne tunne ega suvaline fantaasia, vaid elav Isik – Jeesus Kristus. Kui otsime Jumalat ausa ja alandliku südamega, ilmutab Ta end meile selgelt ja vabastab pettusest.',
      bibleVerses: [
        {
          ref: '1. Timoteosele 2:5',
          text: 'Sest üks on Jumal, üks on ka vahemees Jumala ja inimeste vahel: inimene Kristus Jeesus.'
        },
        {
          ref: 'Apostlite teod 4:12',
          text: 'Ja ei ole päästet üheski teises, sest taeva all ei ole antud inimestele ühtegi teist nime, kelle läbi meid päästetaks.'
        }
      ]
    },
    {
      id: 'hea-inimene-paasemine',
      number: 2,
      question: 'Aga ma olen ju hea inimene, kas siis sellest ei piisa, et pääseda (põrgust)?',
      summary: 'Enamik inimesi püüab elada moraalselt ega soovi teistele kurja. Kuid Jumala püha standardi ees oleme me kõik eksinud ja vajame lunastust.',
      tractQuote: '«Me võrdleme end sageli teistega ja mõtleme: ma pole kedagi tapnud, ma olen hea inimene. Kuid Jumala ees ei piisa heategudest patu katmiseks – vaja on andestust, meeleparandust ja uut sündi Kristuses.»',
      biblicalAnswer: 'Isegi parimad inimlikud teod ei suuda kustutada meie mineviku eksimusi ega patu vaimulikku võlga. Pääste ei ole tasu ega teene, vaid tasuta armuand Jumalalt, mille võtame vastu usus Jeesusesse, kes kandis meie karistuse ristil.',
      bibleVerses: [
        {
          ref: 'Roomlastele 3:23-24',
          text: 'Sest kõik on pattu teinud ja ilma jäänud Jumala kirkusest ning mõistetakse õigeks täiesti muidu, tema armust, lunastuse läbi, mis on Kristuses Jeesuses.'
        },
        {
          ref: 'Efeslastele 2:8-9',
          text: 'Sest teie olete armust päästetud usu kaudu - ja see pole teist enestest, see on Jumala and -, mitte tegudest, et ükski ei saaks kiidelda.'
        }
      ]
    },
    {
      id: 'hoia-kodu-puhas',
      number: 3,
      question: 'Hoia oma kodu puhas!',
      summary: 'Miks ei tohi kodus hoida esoteerilisi esemeid, tarokaarte, unenäopüüdjaid, talismane või ebajumalate kujukesi? Kuidas saavutada tõeline rahu oma kodus?',
      tractQuote: '«Hoia oma kodu puhas! Viska välja kõik nõiduse, ennustamise, horoskoopide, idamaade ebajumalate ja esoteerikaga seotud asjad. Need avavad uksi vaimulikule pimedusele, hirmudele ja rahutusele.»',
      biblicalAnswer: 'Piibel hoiatab vankumatult okultismi, kaardipanemise, vaimudega suhtlemise ja teadmameeste eest. Need ei ole süütud asjad, vaid tegelikud vaimsed sidemed pimeduse jõududega. Tõelise rahu toob Jeesuse veri, Tema kaitse ja Jumala Sõna kuulutamine oma elus.',
      bibleVerses: [
        {
          ref: '5. Moosese 18:10-12',
          text: 'Ärgu leidugu sinu keskel kedagi... kes toimetab nõidust, märkide seletamist, lausumist ega tegele vaimudega... sest igaüks, kes seda teeb, on Issandale jäle.'
        },
        {
          ref: 'Apostlite teod 19:19',
          text: 'Paljud neist, kes olid tegelnud nõiakunstiga, tõid kokku oma raamatud ja põletasid need kõigi nähes ära.'
        }
      ],
      practicalSteps: [
        'Vaata kriitiliselt üle oma kodu: esoteerilised raamatud, kaardid, talismanid, kristallid, kujukesed.',
        'Viska need asjad julgelt minema ja ütle lahti igasugusest okultistlikust praktikast.',
        'Palu Jeesuselt andestust ja kutsu Tema Püha Vaim ning inglite kaitse oma eluasemele.'
      ]
    }
  ],

  cleanlinessTitle: 'Hoia oma kodu puhas!',
  cleanlinessSubtitle: 'Vaimulik kaitse & vabanemine',
  cleanlinessDescription: 'Esoteerilised sümbolid, tarokaardid, unenäopüüdjad, horoskoopide trükised või idamaade ebajumalate kujukesed ei ole süütud sisekujunduselemendid. Need toovad kodudesse seletamatut rahutust, hirmuunenägusid ja vaimulikku rõhumist. Jeesus Kristus pakub täielikku vabadust ja kaitset kõigile, kes Tema poole pöörduvad.',
  cleanlinessSteps: [
    { title: '1. Tuvasta ja viska välja', desc: 'Otsi üles kõik esoteerilised esemed, kaardid, kristallid, amuletid ja kujukesed ning viska need prügikasti.' },
    { title: '2. Tunnista ja loobu', desc: 'Ütle kuuldavalt Jeesusele, et palud andestust okultismiga tegelemise eest ja loobud igasugusest sidemest pimedusega.' },
    { title: '3. Õnnista oma kodu', desc: 'Palu, et Jeesuse veri puhastaks sinu elamise ja et Jumala rahu ning Püha Vaim täidaksid iga ruumi.' }
  ],

  // Real life testimonials / stories with YouTube video embeds
  testimonials: [
    {
      id: 'vabanemine-esoteerikast',
      title: 'Vabanemine esoteerika ja okultismi köidikutest',
      person: 'Tõestisündinud vabanemislugu',
      type: 'vabanemine',
      summary: 'Aastaid kestnud otsingud new age\'is, joogas ja selgeltnägemises tõid lõpuks hirmu ja unetuse. Kuidas Jeesus tõi ühe palvega täieliku vabanemise ja hingerahu.',
      fullStory: 'Olin aastaid veendunud, et kividel, kaartidel ja idamaade tehnikatel on positiivne energia. Aja jooksul asendus esialgne huvi seletamatute hirmude, öiste paanikahoogude ja vaimse väsimusega. Kui mulle ulatati Uus Testament ja soovitati paluda Jeesuse nime, tundsin esimest korda tõelist, sooja ja vabastavat rahu. Viskasin kõik esoteerilised asjad välja ja sellest päevast peale on minu kodus ja südames rahu.',
      youtubeId: 'dQw4w9WgXcQ', // Can be customized in Admin
      youtubeUrl: 'https://www.youtube.com'
    },
    {
      id: 'ime-ja-tervenemine',
      title: 'Tervenemine ja meeleheite lõpp',
      person: 'Isiklik tunnistus',
      type: 'tervenemine',
      summary: 'Arstide lootusetu diagnoos ja sügav depressioon asendusid uue elujõuga pärast eestpalvet ja Jeesuse vastuvõtmist.',
      fullStory: 'Kui tervis ja tulevik näisid täielikult kokku varisevat, leidsin tee kristliku kirjanduse ja palveni. Jeesus tervendas mitte ainult minu füüsilise keha, vaid taastas minu usalduse ja elumõtte.',
      youtubeId: '',
      youtubeUrl: ''
    }
  ],

  // Publisher story & books with purchasing
  publisherStoryTitle: 'Kirjastuse Saagu Valgus sünnilugu',
  publisherStoryText: 'Kirjastus Saagu Valgus sai alguse sügavast igatsusest tuua Eesti inimesteni selget, moonutamata ja elumuutvat vaimulikku kirjandust. Meie missiooniks on kirjastada raamatuid ja tasuta evangeelseid trükiseid, mis avavad silmi, aitavad vabaneda pimeduse pettustest ning juhivad inimesi elavasse suhtesse Jeesuse Kristusega.',

  books: [
    {
      id: 'laps-ja-jumal',
      title: 'Laps ja Jumal',
      author: 'Kirjastus Saagu Valgus',
      category: 'Perekond ja vaimulik kasvamine',
      price: 15,
      description: 'Südamlik ja praktiline raamat, mis aitab mõista laste vaimulikku tundlikkust ja seda, kuidas juhatada järgmist põlvkonda armastuse ja tõe vaimus elava Jumala tundmisele.',
      highlights: [
        'Kuidas rääkida lastele Jumalast ja usust loomulikult ning siiralt',
        'Praktilised näited ja tõestisündinud lood perede usuteelt',
        'Lapse hinge ja vaimse puhtuse hoidmine tänapäeva meediamaailmas'
      ],
      isFeatured: true
    },
    {
      id: 'ma-olin-saatana-vang',
      title: 'Ma olin saatana vang',
      author: 'Kirjastus Saagu Valgus',
      category: 'Tõestisündinud vabanemislugu',
      price: 16,
      description: 'Vapustav ja tõestisündinud tunnistus inimesest, kes oli sügaval okultismi, nõiduse ja pimeduse köidikutes, kuid kelle Jeesus Kristus imeliselt ja täielikult vabastas.',
      highlights: [
        'Aus pilguheit esoteerika ja okultismi tegelikule vaimsele hinnale',
        'Jeesuse Kristuse risti ja nime ülim meelevald kurjuse üle',
        'Teejuht täieliku vabanemise, andestuse ja uue alguseni'
      ],
      isFeatured: true
    }
  ],

  // Support / Tule toetajaks
  support: {
    title: 'Tule toetajaks!',
    subtitle: 'Aita levitada Valgust üle kogu Eestimaa',
    description: 'Kirjastus Saagu Valgus annab välja tasuta evangeelseid trükiseid ja elumuutvaid raamatuid. Sinu toetus aitab trükkida uusi infomaterjale, postitada raamatuid ning viia tõe sõnumit nendeni, kes seda kõige enam vajavad.',
    recipientName: 'Kirjastus Saagu Valgus',
    iban: 'EE123456789012345678', // Editable in admin
    bankName: 'Swedbank / LHV Pank',
    swift: 'HABALV22',
    reference: 'Annetus kirjastustööks',
    explanation: 'Kirjastuse toetus / Trükiste väljaandmine',
    supportGoals: [
      'Tasuta evangeelsete trükiste trükkimine ja postitamine üle Eesti',
      'Uute vaimulike raamatute ja tunnistuste tõlkimine ning kirjastamine',
      'Vaimuliku toe ja infomaterjalide kättesaadavaks tegemine otsijatele'
    ]
  },

  salvationPrayerTitle: 'Päästepalve',
  salvationPrayerSubtitle: 'Kuidas alustada uut elu koos Jumalaga?',
  salvationPrayerIntro: 'Kui sa soovid saada andeks oma patud, leida sügavat rahu ja igavest elu, võid palvetada selle lihtsa ja siira palve valjusti oma südamega:',
  salvationPrayerText: `«Kallis Issand Jeesus!

Mina tulen täna Sinu juurde. Ma tunnistan, et olen patune inimene ja olen teinud oma elus vigu. Ma palun südamest andeks kõik oma patud.

Ma usun, et Sina surid ristil minu eest ja tõusid surnuist üles. Ma võtan Sind täna vastu oma isiklikuks Päästjaks ja Issandaks.

Puhasta mind, täida mind oma Püha Vaimuga ja kingi mulle igavene elu. 

Aamen!»`,
  salvationPrayerNextSteps: [
    {
      title: '1. Loe Piiblit iga päev',
      desc: 'Alusta näiteks Johannese evangeeliumist, et tundma õppida Jeesuse elu, õpetust ja Tema armastust.'
    },
    {
      title: '2. Räägi Jumalaga (palveta)',
      desc: 'Palve on siiras vestlus oma Loojaga – usalda Talle oma mured, soovid ja tänu.'
    },
    {
      title: '3. Leia elav kogudus',
      desc: 'Otsi kristlik kogudus, kus õpetatakse Piibli tõde ja kus saad usus kasvada koos teiste vendade-õdedega.'
    }
  ],

  // Lord's Prayer (Meie Isa palve)
  lordPrayer: {
    title: 'Meie Isa palve',
    subtitle: 'Palve, mida õpetas Jeesus Kristus',
    intro: 'Meie Isa palve (Matteuse 6:9–13) on universaalne ja võimas palve, mis seab esikohale Jumala tahte ja Tema kuningriigi ning palub igapäevast leiba, andestust ja kaitset kurja eest.',
    text: `Meie Isa, kes Sa oled taevas!
Pühitsetud olgu Sinu nimi.
Sinu riik tulgu,
Sinu tahtmine sündigu
nagu taevas, nõnda ka maa peal.
Meie igapäevane leib anna meile tänapäev.
Ja anna meile andeks meie võlad,
nagu meiegi andeks anname oma võlglastele.
Ja ära saada meid kiusatusse,
vaid päästa meid ära kurjast.
Sest Sinu päralt on riik ja vägi ja au igavesti.
Aamen.`,
    ref: 'Matteuse 6:9-13'
  }
};
