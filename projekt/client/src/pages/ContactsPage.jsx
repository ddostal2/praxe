import '../styles/PageShared.css';
import '../styles/ContactsPage.css';
import { useState } from 'react';

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateName = (value) => {
    if (!value.trim()) return 'Zadejte jméno.';
    return undefined;
  };

  const validateEmail = (value) => {
    if (!value.trim()) return 'Zadejte e-mail.';
    if (!value.includes('@')) return 'E-mail musí obsahovat znak @.';
    return undefined;
  };

  const validateQuestion = (value) => {
    if (!value.trim()) return 'Zadejte dotaz.';
    if (value.trim().length < 10) return 'Dotaz musí mít alespoň 10 znaků.';
    return undefined;
  };

  const validateAll = ({ name: nextName, email: nextEmail, question: nextQuestion }) => {
    const nextErrors = {};

    const nameError = validateName(nextName);
    if (nameError) nextErrors.name = nameError;

    const emailError = validateEmail(nextEmail);
    if (emailError) nextErrors.email = emailError;

    const questionError = validateQuestion(nextQuestion);
    if (questionError) nextErrors.question = questionError;

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      question: question.trim(),
    };

    const nextErrors = validateAll(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      //const endpoint = ""; // není backend

      //if (!endpoint) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      /*} else {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      }*/

      setName('');
      setEmail('');
      setQuestion('');
      setErrors({});
      setSubmitStatus({ type: 'success', message: 'Děkujeme! Zpráva byla odeslána.' });
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Odeslání se nepovedlo. Zkuste to prosím znovu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <section className="contact-form page-panel contacts-map-note" aria-label="Kontaktujte nás">
        <form className="" noValidate onSubmit={handleSubmit}>
          <h2 className="contact-form__title">Kontaktujte nás</h2>

          <div className="contact-form__grid">
            <div className="contact-form__field">
              <label className="contact-form__label" htmlFor="contact-name">
                Jméno
              </label>
              <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className="contact-form__input"
                  value={name}
                  onChange={(e) => {
                    const next = e.target.value;
                    setName(next);
                    setErrors((prev) => ({ ...prev, name: validateName(next) }));
                  }}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
              />
              {errors.name && (
                <div className="contact-form__error" id="contact-name-error" role="alert">
                  {errors.name}
                </div>
              )}
            </div>

            <div className="contact-form__field">
              <label className="contact-form__label" htmlFor="contact-email">
                E-mail
              </label>
              <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="contact-form__input"
                  value={email}
                  onChange={(e) => {
                    const next = e.target.value;
                    setEmail(next);
                    setErrors((prev) => ({ ...prev, email: validateEmail(next) }));
                  }}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
              />
              {errors.email && (
                <div className="contact-form__error" id="contact-email-error" role="alert">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="contact-form__field contact-form__field--full">
              <label className="contact-form__label" htmlFor="contact-question">
                Dotaz
              </label>
              <textarea
                  id="contact-question"
                  name="question"
                  className="contact-form__textarea"
                  rows={4}
                  value={question}
                  onChange={(e) => {
                    const next = e.target.value;
                    setQuestion(next);
                    setErrors((prev) => ({ ...prev, question: validateQuestion(next) }));
                  }}
                  aria-invalid={Boolean(errors.question)}
                  aria-describedby={errors.question ? 'contact-question-error' : undefined}
              />
              {errors.question && (
                <div className="contact-form__error" id="contact-question-error" role="alert">
                  {errors.question}
                </div>
              )}
            </div>
          </div>

          {submitStatus?.message && (
            <div
              className={`contact-form__status is-${submitStatus.type}`}
              role="status"
              aria-live="polite"
            >
              {submitStatus.message}
            </div>
          )}

          <div className="contact-form__actions">
            <button className="contact-form__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Odesílám…' : 'Odeslat'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ContactsPage;
