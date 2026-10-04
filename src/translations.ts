import { SiteContent } from './types';

export type Language = 'et' | 'en';

export const SITE_CONTENT_EN: SiteContent = {
  brandName: 'Let There Be Light Publishing',
  brandTagline: 'Publishing spiritual literature, life-transforming testimonies, and evangelistic materials.',
  contactEmail: 'info@saaguvalgus.eu',
  heroBadge: 'Light or darkness?',
  heroTitle: 'Light or',
  heroHighlight: 'darkness?',
  heroDescription: 'Our land is surrounded by spiritual deception. Many seek help from psychics, fortune tellers, and healers rather than the living God. Esoteric shops and new age philosophies are spreading rapidly, leading souls away from truth.',
  
  primaryVerse: {
    ref: 'Joel 2:32',
    text: 'And it shall come to pass that whoever calls on the name of the Lord shall be saved.',
    theme: 'Promise of Salvation',
    isPrimary: true
  },

  coreVerses: [
    {
      ref: 'Joel 2:32',
      text: 'And it shall come to pass that whoever calls on the name of the Lord shall be saved.',
      theme: 'Promise of Salvation and Deliverance'
    },
    {
      ref: 'John 3:16',
      text: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.',
      theme: 'God\'s Love and Eternal Life'
    },
    {
      ref: '2 Kings 17:17',
      text: 'And they caused their sons and daughters to pass through the fire, practiced witchcraft and soothsaying, and sold themselves to do evil in the sight of the Lord, provoking Him to anger.',
      theme: 'Warning Against the Occult and Witchcraft'
    }
  ],

  centralQuestions: [
    {
      id: 'noidade-selgeltnagijate-vagi',
      number: 1,
      question: 'Have you ever wondered: TO WHOM BELONGS THE POWER OF WITCHES, PSYCHICS, AND HEALERS?',
      fullText: `In bookstores today, books on witchcraft and astrology occupy prime shelves. Psychics and fortune tellers are welcomed on television, and esoteric shops are everywhere.

Yet this is by no means an innocent game. By placing yourself in the care of a psychic or medium, you are extending a hand of friendship to the enemy of your soul—Satan, who is far more real than most humanity ever realizes.

There is One who hates witchcraft with all His heart—and that is God, the Creator of you, me, and all mankind.

By turning to witches and fortune tellers, you inevitably place yourself as an enemy of God. Any temporary relief they seem to provide brings curses as its consequence—sickness, death, or oppression. Furthermore, practicing the occult places your children and future generations in grave spiritual danger according to God's Word.

Hell is a real place. But your Creator desires to save and deliver you! Turn to Jesus Christ for help! Reach out to a living Christian church and ask for prayer.

"Outside are dogs and sorcerers and sexually immoral and murderers and idolaters, and whoever loves and practices a lie." Revelation 22:15

The Bible also tells us that there are only two dominant spiritual conditions in our lives—blessing or curse. Both flow according to God's spiritual laws and are directly tied to our choices.

"I call heaven and earth as witnesses today against you, that I have set before you life and death, blessing and cursing; therefore choose life, that both you and your descendants may live." Deuteronomy 30:19`,
      bibleVerses: [
        {
          ref: 'Revelation 22:15',
          text: 'Outside are dogs and sorcerers and sexually immoral and murderers and idolaters, and whoever loves and practices a lie.'
        },
        {
          ref: 'Deuteronomy 30:19',
          text: 'I have set before you life and death, blessing and cursing; therefore choose life, that both you and your descendants may live.'
        },
        {
          ref: '2 Kings 17:17',
          text: 'And they practiced witchcraft and soothsaying, and sold themselves to do evil in the sight of the Lord, provoking Him to anger.'
        }
      ],
      practicalSteps: [
        'Immediately sever all contact with witches, psychics, mediums, and occult healers.',
        'Turn for help and salvation to the living God and Jesus Christ alone.',
        'Reach out to a Bible-believing church and request prayer for freedom.'
      ],
      category: 'hook'
    },
    {
      id: 'jooga-tegelik-olemus',
      number: 2,
      question: 'Have you ever wondered: WHAT IS YOGA REALLY ABOUT?',
      fullText: `Across the world, yoga continues to gain immense popularity. Most people have no idea that it is not merely physical stretching, but a religious and spiritual practice through which doors are opened to dark spiritual influences.

There is no such thing as spiritually neutral yoga. The Sanskrit word "yoga" means union or yoking. The original purpose was never physical exercise or wellness, but spiritual union with the Hindu concept of the divine reality known as Brahman.

While Western culture treats yoga as neutral stretching, the vast majority of yoga postures (asanas) originate from mythological and religious deities—in other words, idols. And worshipping idols is something God, your Creator, explicitly forbids.

For example: Padmāsana (lotus pose) is designed to open divine consciousness, dedicated to the goddess Lakshmi and Brahma. Natarājāsana (dancer pose) depicts Shiva as the cosmic dancer creating and destroying the universe. Vīrabhadrāsana (warrior pose) represents the fierce warrior born from Shiva's wrath.

Even if you don't immediately feel anything unusual after a yoga session, it affects you spiritually. Negative consequences often appear later as anxiety, oppression, or unexplained ailments.

If you have practiced or are currently practicing yoga—turn away from it and ask Jesus Christ for forgiveness and cleansing.

Hell is real, but your Creator loves you and wishes to save you! Call upon Jesus Christ and find true peace.`,
      bibleVerses: [
        {
          ref: '1 Corinthians 10:21',
          text: 'You cannot drink the cup of the Lord and the cup of demons; you cannot partake of the Lord\'s table and of the table of demons.'
        },
        {
          ref: 'Joel 2:32',
          text: 'Whoever calls on the name of the Lord shall be saved.'
        }
      ],
      practicalSteps: [
        'Understand that yoga postures and philosophies are inextricably linked to Eastern religious deities.',
        'If you have engaged in yoga, repent and renounce it, asking Jesus for forgiveness.',
        'Seek true inner peace and rest in Jesus Christ, and ask a Christian fellowship for prayer.'
      ],
      category: 'hook'
    },
    {
      id: 'new-age-uusvaimsus',
      number: 3,
      question: 'Have you ever wondered: WHAT SPIRITUALITY DOES THE NEW AGE REALLY CARRY?',
      fullText: `When you see posts online using attractive phrases like "I am light", "I am love", "I create my own reality", or "I am my own god", know that this is the core of New Age deception.

Common terms include: "channeling", "transcendental meditation", "higher self", "law of attraction", "healing crystals", "holistic energy", "tantra", "mantras", "mandalas", and more.

New Age brings together a broad spectrum of spiritual practices that promise enlightenment, but instead lead people into the enemy's grasp, from which it is often very difficult to escape.

Hell is real. But your Creator wants to deliver you! Call upon Jesus Christ! Reach out to a living Christian fellowship and ask for prayer.

"And no wonder! For Satan himself transforms himself into an angel of light." 2 Corinthians 11:14`,
      bibleVerses: [
        {
          ref: '2 Corinthians 11:14',
          text: 'And no wonder! For Satan himself transforms himself into an angel of light.'
        },
        {
          ref: 'John 14:6',
          text: 'Jesus said to him: I am the way, the truth, and the life. No one comes to the Father except through Me.'
        }
      ],
      practicalSteps: [
        'Recognize the New Age deception ("I am my own god", crystals, channeling, cosmic energy).',
        'Turn from demonic bondage to the one living Creator in the name of Jesus Christ.',
        'Ask believers in Christ to pray with you and receive true spiritual freedom.'
      ],
      category: 'hook'
    }
  ],

  tractQuestions: [
    {
      id: 'hoia-kodu-puhas',
      number: 1,
      question: 'Keep your home clean! (Cursed and occult objects in our homes)',
      fullText: `It is vital to know that our homes must be cleansed of objects that open doors to spiritual oppression and curses. This can be a souvenir from an esoteric shop or any item used in witchcraft or occult rituals.

Keeping items connected to witchcraft, divination, or foreign gods is sin before the Lord—it is an agreement with darkness and Satan.

If you experience unexplainable oppression, heaviness, or nightmares, examine your home. Cleanse your living space of "things belonging to the enemy"—everything related to magic, idolatry, or cursed items.

"You shall burn the carved images of their gods with fire; you shall not covet the silver or gold that is on them, nor take it for yourselves, lest you be snared by it; for it is an abomination to the Lord your God. Nor shall you bring an abomination into your house, lest you be doomed to destruction like it. You shall utterly detest it and utterly abhor it, for it is an accursed thing." Deuteronomy 7:25-26`,
      bibleVerses: [
        {
          ref: 'Deuteronomy 7:25-26',
          text: 'You shall burn the carved images of their gods with fire... Nor shall you bring an abomination into your house, lest you be doomed to destruction like it.'
        }
      ],
      practicalSteps: [
        'Critically inspect your home: esoteric souvenirs, charms, witchcraft items, and idol statues.',
        'Throw away and destroy all objects connected to the occult and false spiritualities.',
        'Pray and invite God\'s presence, peace, and the Holy Spirit to cleanse and bless your home.'
      ]
    },
    {
      id: 'igauele-oma-jumal',
      number: 2,
      question: 'Many gods—is that the truth? ("To each their own god")',
      fullText: `Our era promotes the idea that many different gods exist (Buddhism, Hinduism, Islam, etc.) and that all paths lead to the same destination. People believe everyone can choose a god according to their personal preference.

However, this is not true. The ultimate objective of alternative, deceptive religions is to lead mankind away from the true, living God. It is a spiritual trap to keep people under bondage so they never turn to the only Savior.

"For the wrath of God is revealed from heaven against all ungodliness and unrighteousness of men, who suppress the truth in unrighteousness." Romans 1:18`,
      bibleVerses: [
        {
          ref: 'Romans 1:18',
          text: 'For the wrath of God is revealed from heaven against all ungodliness and unrighteousness of men, who suppress the truth in unrighteousness.'
        },
        {
          ref: 'John 14:6',
          text: 'Jesus said to him: "I am the way, the truth, and the life. No one comes to the Father except through Me."'
        }
      ]
    },
    {
      id: 'hea-inimene-paasemine',
      number: 3,
      question: 'Will I be saved from hell if I am a "good person"?',
      fullText: `Another common misconception is that simply being a good, moral person guarantees that everything is fine and that good people surely will not end up in hell. Yet God's Word declares that without Jesus Christ, the only begotten Son of God, salvation is impossible.

Satan does not mind if you are a nice person. He is not bothered if you volunteer, recycle, or help neighbors. His only goal is that you do not bow your knee before Jesus Christ as Lord and Savior.

Being a morally upright person is not the same as being born again in Christ. We are all in need of redemption.

"For all have sinned and fall short of the glory of God." Romans 3:23

The good news is that we are still in the season of grace! You can return to your Heavenly Father today by receiving His Son Jesus Christ into your heart.`,
      bibleVerses: [
        {
          ref: 'Romans 3:23',
          text: 'For all have sinned and fall short of the glory of God.'
        },
        {
          ref: 'John 14:6',
          text: 'Jesus said to him: "I am the way, the truth, and the life. No one comes to the Father except through Me."'
        },
        {
          ref: '2 Chronicles 7:14',
          text: 'If My people who are called by My name will humble themselves, and pray and seek My face, and turn from their wicked ways, then I will hear from heaven, and will forgive their sin and heal their land.'
        },
        {
          ref: '1 Corinthians 10:21',
          text: 'You cannot drink the cup of the Lord and the cup of demons; you cannot partake of the Lord\'s table and of the table of demons.'
        }
      ]
    }
  ],

  cleanlinessTitle: 'Keep your home clean!',
  cleanlinessSubtitle: 'Spiritual protection & freedom',
  cleanlinessDescription: 'Our living spaces must be cleansed of objects that open doors to curses or spiritual oppression. Esoteric souvenirs, witchcraft items, or objects used in divination are an abomination before God. Cleansing your home brings God\'s peace and protection.',
  cleanlinessSteps: [
    { title: 'Understand the nature of yoga', desc: 'Understand that yoga postures and philosophies are inextricably linked to Eastern religion.' },
    { title: 'Identify and remove', desc: 'Cleanse your home of things belonging to darkness—esoteric souvenirs, crystals, occult tools, and statues of false gods.' },
    { title: 'Repent and ask forgiveness', desc: 'Turn away from involvement with the occult and ask forgiveness in the name of Jesus Christ.' },
    { title: 'Pray for God\'s blessing', desc: 'Invite the peace of God and the Holy Spirit into your home to seal and protect your family.' }
  ],

  testimonials: [
    {
      id: 'kairi-oja-tunnistus',
      title: 'Kairi\'s Testimony – Deliverance from 5 Years of Heavy Spiritual Bondage',
      person: 'Kairi Oja',
      type: 'vabanemine',
      date: '08.03.2025',
      image: '/src/assets/images/kairi_oja_portrait_1791059785550.jpg',
      facebookUrl: 'https://www.facebook.com/share/1DUothVLCF/',
      facebookPageTitle: 'Saagu Valgus - Is God Real?',
      summary: 'We live in a spiritual world that dominates visible reality. On March 8, 2025, Jesus Christ set me completely free from five long years (2020–2025) of severe spiritual bondage, torment, and oppression. All praise and glory to the Lord!',
      fullStory: `We live in a spiritual world that dominates the reality we are accustomed to seeing. On March 8, 2025, Jesus Christ set me completely free from five long years (2020–2025) of severe spiritual bondage, torment, and oppression. All glory to the Lord!

What is spiritual bondage?
It is a condition where Satan gains dominion over a person through evil spirits. For five years, I could not care for my son (who was 13 when it began), I could not work, and could do nothing but sit or lie on the edge of the bed in agony. This was not depression; it was purely demonic oppression.

For 14 years, I had been merely a nominal Christian—baptized in 2008, yet without a personal relationship with Jesus, never reading God's Word. Sin, pride, New Age philosophies, visiting fortune tellers, and keeping cursed items in my home opened legal doors for the enemy. In 2017, I had authored a children's book featuring witchcraft and ungodly language, unwittingly entering a covenant with darkness.

I tried finding help 24/7 across Estonia and abroad, but true breakthrough came on March 8, 2025, when Canadian ministers through the Holy Spirit uncovered the hidden roots of the bondage. I underwent deep repentance, publicly renounced the ungodly book, cleansed my home of all occult items, and embraced Jesus Christ as my Lord and Savior.

Since then, Jesus has restored my soul, healed my body, enabled me to lose 50 kg within 12 months, restored my ability to ride my bicycle, and filled me with supernatural peace.

WARNINGS:
• Do not play with sin or enter into agreement with Satan!
• Fear the Lord: "Do not be deceived, God is not mocked; for whatever a man sows, that he will also reap." (Galatians 6:7)
• Cleanse your home of all cursed and occult objects! (Deuteronomy 7:26)
• Avoid New Age philosophies and yoga, which open doors to dark spiritual forces.

THE GOOD NEWS:
God loves you and offers salvation through His Son Jesus Christ!
"If we confess our sins, He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness." (1 John 1:9)`
    },
    {
      id: 'vabanemine-esoteerikast',
      title: 'Deliverance from the Bonds of Esotericism and Occultism',
      person: 'True Story of Deliverance',
      type: 'vabanemine',
      summary: 'Years of searching through esotericism and occult practices led to deep despair. Calling upon the name of Jesus brought complete freedom and peace.',
      fullStory: 'When I received a New Testament and learned that Jesus Christ died on the cross for my sins, I called upon His name. In that moment, years of fear vanished and true peace filled my heart.',
      youtubeId: '',
      youtubeUrl: ''
    },
    {
      id: 'ime-ja-tervenemine',
      title: 'Miraculous Healing and the End of Despair',
      person: 'Personal Testimony',
      type: 'tervenemine',
      summary: 'A hopeless medical diagnosis was replaced with supernatural healing after intercession and turning to the living God.',
      fullStory: 'God still answers prayers today. Turning to the living Creator brought His healing love and a completely transformed life.',
      youtubeId: '',
      youtubeUrl: ''
    }
  ],

  publisherStoryTitle: 'The Story of Let There Be Light Publishing',
  publisherStoryText: 'Let There Be Light Publishing was born out of a deep yearning to bring clear, uncompromised, and life-transforming Christian literature to people. Our mission is to publish books, tracts, and evangelistic materials that open eyes, deliver people from darkness, and guide them into a living relationship with Jesus Christ.',

  books: [
    {
      id: 'laps-ja-jumal',
      title: 'Child and God',
      author: 'Let There Be Light Publishing',
      category: 'Children\'s Book',
      description: 'In "Child and God", children from Christian families share their authentic experiences with God—how they see their Creator, what He has done in their lives, and how He answers their prayers.',
      highlights: [
        'Heartfelt experiences of children with their loving Creator',
        'Inspiring stories of answered prayers and daily protection',
        'Warm, beautifully illustrated book for the whole family'
      ],
      isFeatured: true,
      isPreOrder: true,
      preOrderNote: 'In Preparation',
      releaseDate: 'In Preparation'
    },
    {
      id: 'ma-olin-saatana-vang',
      title: 'I Was Satan\'s Prisoner',
      author: 'Let There Be Light Publishing',
      category: 'True Story of Deliverance',
      description: 'The gripping, true testimony of a person deeply entangled in occultism and witchcraft, whom Jesus Christ miraculously and completely set free.',
      highlights: [
        'An honest look at the real spiritual cost of esotericism and occultism',
        'The supreme authority of Jesus Christ\'s cross over all dark forces',
        'A practical guide to forgiveness, deliverance, and a brand new life'
      ],
      isFeatured: true,
      isPreOrder: true,
      preOrderNote: 'In Preparation',
      releaseDate: 'In Preparation'
    },
    {
      id: 'saagu-valgus-raamat',
      title: 'Let There Be Light: Truth and Freedom',
      author: 'Let There Be Light Publishing',
      category: 'Spiritual Guide / New Publication',
      description: 'A comprehensive new handbook that addresses deep spiritual questions, deliverance from darkness, and living in the radiant grace of God.',
      highlights: [
        'In-depth answers to 3 core questions and esoteric dangers',
        'Complete guide to cleansing your home and spiritual atmosphere',
        'Authentic healing and deliverance testimonies'
      ],
      isFeatured: true,
      isPreOrder: true,
      preOrderNote: 'In Preparation',
      releaseDate: 'In Preparation'
    }
  ],

  support: {
    title: 'Support the Ministry!',
    subtitle: 'Help spread the Light across the land',
    description: 'Let There Be Light Publishing produces evangelistic tracts and life-changing literature. Your support helps print new materials, mail literature, and bring truth to those in urgent need.',
    recipientName: 'Kairi Oja',
    iban: 'EE537700771000431636',
    bankName: 'LHV Bank',
    swift: 'LHVBEE22',
    reference: 'Ministry donation',
    explanation: 'Ministry and website support',
    paypalEmail: 'Kairioja777@proton.me',
    paypalNote: 'If this website has been a blessing to You, You can donate here:',
    bookSalesNote: 'Book purchases and publications distribution are invoiced through Saagu Valgus OÜ.',
    supportGoals: [
      'Printing and distributing evangelistic tracts across the country',
      'Publishing new Christian books and true testimonies',
      'Providing spiritual resources freely to seekers and communities'
    ]
  },

  salvationPrayerTitle: 'Prayer of Salvation',
  salvationPrayerSubtitle: 'Prayer to the Living God',
  salvationPrayerIntro: 'If you desire to repent, turn away from darkness, and receive salvation, pray this prayer sincerely from your heart:',
  salvationPrayerText: `Dear Heavenly Father!

I come to You in the name of Jesus Christ. I am a sinner. Please forgive all my sins. Come into my heart. Guide me and make me new. Thank You, Lord Jesus, for the cross of Calvary, that You shed Your precious blood for my sins so that I might receive forgiveness and have eternal life.

Please fill me with Your Holy Spirit. I receive the Holy Spirit right now. Your Word says: "The word is near you, in your mouth and in your heart... that if you confess with your mouth the Lord Jesus and believe in your heart that God has raised Him from the dead, you will be saved. For with the heart one believes unto righteousness, and with the mouth confession is made unto salvation." Romans 10:8-9.

Now I confess with my mouth that Jesus Christ is Lord, and I believe in my heart that God raised Him from the dead. He carried my sins and curses to the cross and was raised from the dead so that I may become a child of God. Thank You that according to Your Word, I am saved. Amen.

Dear Lord Jesus, please grant me Your peace as confirmation, as it is written in John 14:27: "Peace I leave with you, My peace I give to you; not as the world gives do I give to you. Let not your heart be troubled, neither let it be afraid."
Thank You for Your peace.
Amen.`,
  salvationPrayerNextSteps: [
    {
      title: '1. Turn to Jesus Christ',
      desc: 'Confess with your mouth and believe in your heart that Jesus is Lord and God raised Him from the dead.'
    },
    {
      title: '2. Connect with a Living Church',
      desc: 'Reach out to a Bible-believing Christian congregation and ask for prayer and fellowship.'
    },
    {
      title: '3. Keep Your Life & Home Clean',
      desc: 'Renounce all forms of witchcraft, occultism, and idols, and anchor your life in God\'s Word daily.'
    }
  ],

  lordPrayer: {
    title: 'The Lord\'s Prayer',
    subtitle: 'The Lord\'s Prayer',
    intro: 'The prayer taught by Jesus Christ:',
    text: `Our Father in heaven, hallowed be Your name.
Your kingdom come, Your will be done on earth as it is in heaven.
Give us this day our daily bread.
And forgive us our debts, as we forgive our debtors.
And do not lead us into temptation, but deliver us from the evil one.
For Yours is the kingdom and the power and the glory forever. Amen.`,
    ref: 'Matthew 6:9-13 (The Bible)'
  }
};

export const UI_TRANSLATIONS = {
  et: {
    langName: 'Eesti',
    switchLang: 'Muuda keelt',
    nav: {
      topics: 'Teemad',
      cleanHome: 'Puhas kodu',
      testimonials: 'Tunnistused',
      books: 'Raamatud',
      support: 'Toeta',
      prayer: 'Päästepalve',
      contact: 'Kontakt',
      publications: 'Trükised (PDF)',
      admin: 'Admin'
    },
    hero: {
      read3Questions: 'Loe 3 põhiküsimust',
      viewBooks: 'Vaata raamatuid & trükiseid',
      listenVerses: 'Kuula piiblisalme',
      stopAudio: 'Peata heli',
      audioReader: 'Helilugeja (Piiblisalmid)',
      playingVerse: 'Esitatakse salmi:'
    },
    questions: {
      badge: 'Elulised vaimulikud teemad',
      title: '3 Suurt Põhiküsimust',
      subtitle: 'Tõde okultismi, nõiduse, jooga ja new age vaimsuse kohta Jumala Sõna valguses.',
      biblicalVerses: 'Piiblisalmid ja viited:',
      practicalSteps: 'Mida teha? Praktilised sammud:',
      warningBadge: 'Hoiatus okultismi eest',
      theologyBadge: 'Piibellik tõde'
    },
    cleanHome: {
      badge: 'Vaimulik kaitse',
      actionTitle: 'Kodu puhastamise sammud'
    },
    testimonials: {
      badge: 'Tõestisündinud lood',
      title: 'Elumuutvad tunnistused',
      subtitle: 'Kuidas elav Jumal on vabastanud, tervendanud ja muutnud inimeste elusid.',
      readMore: 'Loe täispikka lugu',
      collapse: 'Peida lugu'
    },
    books: {
      badge: 'Kirjandus ja tellimine',
      title: 'Kirjastuse raamatud',
      subtitle: 'Väljaanded, mis avavad silmi ja kinnitavad usku.',
      preOrder: 'Ettetellimine',
      order: 'Telli raamat',
      preOrderNote: 'Ettetellimisel',
      available: 'Saadaval',
      featured: 'Soovitatud'
    },
    publicationsBanner: {
      badge: '',
      sub: 'Laadi alla ja prindi tasuta',
      title: 'Trükised & Materjalid',
      desc: 'Nõiduse, new age ehk uusvaimsuse ja jooga eest hoiatava trükise (A4 formaat, kahepoolne) PDF failid soovi korral allalaadimiseks ja/või väljaprintimiseks',
      openBtn: 'Ava Trükised'
    },
    support: {
      badge: 'Kirjastustöö toetus',
      bankDetails: 'Panga rekvisiidid annetuseks:',
      recipient: 'Saaja:',
      account: 'Konto (IBAN):',
      bank: 'Pank:',
      swift: 'SWIFT / BIC:',
      reference: 'Viitenumber:',
      explanation: 'Selgitus:',
      copyIban: 'Kopeeri IBAN',
      copied: 'Kopeeritud!'
    },
    salvation: {
      badge: 'Pääste Jeesuses Kristuses',
      copyPrayer: 'Kopeeri palve',
      copied: 'Kopeeritud!',
      nextStepsTitle: 'Sinu järgmised sammud pärast pöördumist:'
    },
    lordPrayer: {
      badge: 'Jeesuse õpetatud palve'
    },
    contact: {
      badge: 'Võta ühendust',
      title: 'Võta ühendust kirjastusega',
      subtitle: 'Oleme olemas, kui sul on küsimusi trükiste, raamatute tellimise, levitamise või koostöö kohta.',
      emailTitle: 'E-post',
      emailSub: 'Otsene kontakt meeskonnaga',
      copyEmail: 'Kopeeri e-post',
      copiedEmail: 'Kopeeritud!',
      responseTime: 'Vastame kirjadele tavaliselt 1–2 tööpäeva jooksul.',
      formSuccess: 'Täname kirjutamast! Sinu sõnum on saadetud.',
      sendAnother: 'Saada teine kiri',
      nameLabel: 'Nimi',
      namePlaceholder: 'Sinu nimi',
      emailLabel: 'E-post',
      emailPlaceholder: 'sinu@email.ee',
      msgLabel: 'Sõnum või koostöösoov',
      msgPlaceholder: 'Kirjuta oma küsimus või soov siia...',
      sendBtn: 'Saada sõnum',
      sending: 'Saadan...'
    },
    orderModal: {
      titleOrder: 'Telli raamat',
      titlePreOrder: 'Ettetelli raamat',
      bookSelected: 'Valitud väljaanne:',
      quantity: 'Kogus (tk):',
      name: 'Sinu täisnimi *',
      email: 'E-posti aadress *',
      phone: 'Telefoninumber *',
      address: 'Tarneaadress / Pakiautomaadi asukoht *',
      addressPlaceholder: 'nt Omniva Tallinna Kristiine Keskus või kodune aadress',
      notes: 'Lisamärkused või soovid (vabatahtlik)',
      notesPlaceholder: 'nt Soovin kingituseks pakkimist jne',
      cancel: 'Loobu',
      submitOrder: 'Kinnita tellimus',
      submitPreOrder: 'Kinnita ettetellimine',
      submitting: 'Salvestan...',
      successTitle: 'Tellimus edukalt esitatud!',
      successMsg: 'Täname tellimuse eest! Võtame sinuga e-posti teel ühendust tarne ja täpsustuste osas.',
      close: 'Sulge aken'
    },
    publicationsModal: {
      title: 'Trükised',
      badge: 'PDF & Lugemine',
      subtitle: 'Kirjastuse Saagu Valgus voldikud, infomaterjalid ja trükised',
      searchPlaceholder: 'Otsi trükist...',
      allCategories: 'Kõik',
      page: 'Lehekülg',
      of: '/',
      print: 'Prindi',
      download: 'Laadi alla',
      wideView: 'Lai vaade',
      a4View: 'A4 vaade',
      close: 'Sulge vaatleja',
      noPubs: 'Ühtegi trükist ei leitud.',
      copyLink: 'Jaga',
      copiedLink: 'Kopeeritud',
      prevPage: 'Eelmine leht',
      nextPage: 'Järgmine leht',
      document: 'Dokument:'
    },
    footer: {
      tagline: 'Vaimuliku kirjanduse, elumuutvate tunnistuste ja evangeelsete materjalide kirjastamine Eestis.',
      rights: 'Kõik õigused kaitstud.',
      adminLink: 'Administraatori sisselogimine',
      backToTop: 'Tagasi üles'
    }
  },
  en: {
    langName: 'English',
    switchLang: 'Switch language',
    nav: {
      topics: 'Topics',
      cleanHome: 'Clean Home',
      testimonials: 'Testimonies',
      books: 'Books',
      support: 'Support',
      prayer: 'Salvation Prayer',
      contact: 'Contact',
      publications: 'Publications (PDF)',
      admin: 'Admin'
    },
    hero: {
      read3Questions: 'Read the 3 Core Questions',
      viewBooks: 'View Books & Publications',
      listenVerses: 'Listen to Scripture',
      stopAudio: 'Stop Audio',
      audioReader: 'Audio Reader (Scripture Verses)',
      playingVerse: 'Now Playing Verse:'
    },
    questions: {
      badge: 'Vital Spiritual Questions',
      title: '3 Core Questions',
      subtitle: 'The truth about occultism, witchcraft, yoga, and New Age spirituality in the light of God\'s Word.',
      biblicalVerses: 'Bible Verses and Scripture References:',
      practicalSteps: 'What to do? Practical steps:',
      warningBadge: 'Warning Against the Occult',
      theologyBadge: 'Biblical Truth'
    },
    cleanHome: {
      badge: 'Spiritual Protection',
      actionTitle: 'Steps to Cleanse Your Home'
    },
    testimonials: {
      badge: 'True Stories',
      title: 'Life-Transforming Testimonies',
      subtitle: 'How the living God delivers, heals, and transforms lives today.',
      readMore: 'Read Full Story',
      collapse: 'Hide Story'
    },
    books: {
      badge: 'Literature & Ordering',
      title: 'Published Books',
      subtitle: 'Publications that open eyes, bring freedom, and strengthen faith.',
      preOrder: 'Pre-order',
      order: 'Order Book',
      preOrderNote: 'Pre-order available',
      available: 'Available Now',
      featured: 'Featured'
    },
    publicationsBanner: {
      badge: '',
      sub: 'Download and print for free',
      title: 'Tracts & Materials',
      desc: 'PDF files of a double-sided A4 warning tract cautioning against witchcraft, New Age spirituality, and yoga, available for download and/or printing upon request.',
      openBtn: 'Open Publications'
    },
    support: {
      badge: 'Publishing Ministry Support',
      bankDetails: 'Bank Transfer Details for Donations:',
      recipient: 'Recipient:',
      account: 'Account (IBAN):',
      bank: 'Bank:',
      swift: 'SWIFT / BIC:',
      reference: 'Reference:',
      explanation: 'Description:',
      copyIban: 'Copy IBAN',
      copied: 'Copied!'
    },
    salvation: {
      badge: 'Salvation in Jesus Christ',
      copyPrayer: 'Copy Prayer',
      copied: 'Copied!',
      nextStepsTitle: 'Your Next Steps After Receiving Christ:'
    },
    lordPrayer: {
      badge: 'The Prayer Taught by Jesus'
    },
    contact: {
      badge: 'Get in Touch',
      title: 'Contact the Publisher',
      subtitle: 'We are here if you have questions about books, literature orders, distribution, or ministry cooperation.',
      emailTitle: 'Email',
      emailSub: 'Direct contact with our team',
      copyEmail: 'Copy Email',
      copiedEmail: 'Copied!',
      responseTime: 'We usually respond to messages within 1–2 business days.',
      formSuccess: 'Thank you for writing! Your message has been sent.',
      sendAnother: 'Send another message',
      nameLabel: 'Your Name',
      namePlaceholder: 'Your full name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'you@email.com',
      msgLabel: 'Message or inquiry',
      msgPlaceholder: 'Write your question or request here...',
      sendBtn: 'Send Message',
      sending: 'Sending...'
    },
    orderModal: {
      titleOrder: 'Order Book',
      titlePreOrder: 'Pre-order Book',
      bookSelected: 'Selected Title:',
      quantity: 'Quantity (pcs):',
      name: 'Full Name *',
      email: 'Email Address *',
      phone: 'Phone Number *',
      address: 'Shipping Address / Parcel Machine *',
      addressPlaceholder: 'e.g. Parcel terminal location or home postal address',
      notes: 'Additional notes or requests (optional)',
      notesPlaceholder: 'e.g. Special delivery notes, gift wrapping, etc.',
      cancel: 'Cancel',
      submitOrder: 'Confirm Order',
      submitPreOrder: 'Confirm Pre-order',
      submitting: 'Saving...',
      successTitle: 'Order Successfully Submitted!',
      successMsg: 'Thank you for your order! We will reach out to you via email regarding shipping and details.',
      close: 'Close Window'
    },
    publicationsModal: {
      title: 'Publications',
      badge: 'PDF & Reading',
      subtitle: 'Let There Be Light Publishing tracts, informational guides, and books',
      searchPlaceholder: 'Search publication...',
      allCategories: 'All',
      page: 'Page',
      of: '/',
      print: 'Print',
      download: 'Download',
      wideView: 'Wide View',
      a4View: 'A4 View',
      close: 'Close Viewer',
      noPubs: 'No publications found.',
      copyLink: 'Share',
      copiedLink: 'Copied',
      prevPage: 'Previous Page',
      nextPage: 'Next Page',
      document: 'Document:'
    },
    footer: {
      tagline: 'Publishing spiritual literature, life-transforming testimonies, and evangelistic materials.',
      rights: 'All rights reserved.',
      adminLink: 'Administrator Login',
      backToTop: 'Back to Top'
    }
  }
};
