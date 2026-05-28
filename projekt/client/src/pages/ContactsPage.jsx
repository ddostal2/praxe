import '../styles/PageShared.css';
import '../styles/ContactsPage.css';

const CONTACTS = [
  {
    name: 'Prodejna Praha',
    role: 'Hlavní obchod',
    address: 'Obchodní 12, 110 00 Praha 1',
    phone: '+420 222 333 444',
    email: 'praha@obchod.cz',
    hours: 'Po–Pá 9:00–19:00, So 10:00–16:00',
  },
  {
    name: 'Prodejna Brno',
    role: 'Výdejna a reklamace',
    address: 'Nákupní 5, 602 00 Brno',
    phone: '+420 555 666 777',
    email: 'brno@obchod.cz',
    hours: 'Po–Pá 8:30–18:00',
  },
  {
    name: 'Zákaznická podpora',
    role: 'Objednávky online',
    address: 'E-mail / telefon',
    phone: '+420 800 123 456',
    email: 'podpora@obchod.cz',
    hours: 'Po–Ne 8:00–20:00',
  },
];

const ContactsPage = () => {
  return (
    <div className="page-container contacts-page">
      <header className="page-header">
        <h1>Kontakty</h1>
        <p>
          Máte dotaz k objednávce nebo výběru produktu? Ozvěte se nám — rádi pomůžeme.
        </p>
      </header>

      <div className="page-grid contacts-grid">
        {CONTACTS.map((contact) => (
          <article key={contact.email} className="page-panel contact-card">
            <h2>{contact.name}</h2>
            <p className="contact-card__role">{contact.role}</p>
            <dl className="contact-card__details">
              <div>
                <dt>Adresa</dt>
                <dd>{contact.address}</dd>
              </div>
              <div>
                <dt>Telefon</dt>
                <dd>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
                </dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
              <div>
                <dt>Otevírací doba</dt>
                <dd>{contact.hours}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <section className="page-panel contacts-map-note" aria-label="Jak nás najdete">
        <h2>Jak nás najdete</h2>
        <p>
          Prodejna v Praze je 3 minuty chůze od stanice metra Můstek. V Brně doporučujeme
          tramvaj na zastávku Česká. Pro online objednávky pište na podpora@obchod.cz.
        </p>
      </section>
    </div>
  );
};

export default ContactsPage;
