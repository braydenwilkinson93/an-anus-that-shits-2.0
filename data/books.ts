export interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  status: "Completed" | "In Progress" | "Upcoming";
  reviewExcerpt: string;
  fullReview: string;
}

const review = (text: string) => text;

export const BOOKS: Book[] = [
  ["The Denial of Death", "Ernest Becker", "Completed", "An examination of human character defenses against the terror of mortality."],
  ["The Brothers Karamazov", "Fyodor Dostoevsky", "Completed", "A theological and psychological trial exploring faith, free will, and morality."],
  ["The Plague", "Albert Camus", "Completed", "An allegory of human resilience and absurd heroism amidst inescapable calamity."],
  ["Civilization and Its Discontents", "Sigmund Freud", "Completed", "The fundamental conflict between individual instinctual freedom and societal demands."],
  ["The Myth of Sisyphus", "Albert Camus", "Completed", "Defying the absurd through conscious existence and relentless persistence."],
  ["The Trauma of Birth", "Otto Rank", "Completed", "Tracing primal anxiety back to the fundamental separation from the maternal origin."],
  ["Fear and Trembling", "Søren Kierkegaard", "Completed", "A meditative dissection of the teleological suspension of the ethical."],
  ["Man and His Symbols", "Carl Jung", "Completed", "An accessible entry into the collective unconscious, dream analysis, and archetypes."],
  ["Notes from Underground", "Fyodor Dostoevsky", "Completed", "The founding document of modern existential alienation and psychological realism."],
  ["Escape from Evil", "Ernest Becker", "In Progress", "How death anxiety drives institutional violence, greed, and cultural mythmaking."],
  ["The Stranger", "Albert Camus", "Upcoming", "A portrait of emotional detachment in the face of societal conformity and the absurd."],
  ["Beyond the Pleasure Principle", "Sigmund Freud", "Upcoming", "The introduction of the death drive (Thanatos) alongside the life instinct."],
  ["Thus Spoke Zarathustra", "Friedrich Nietzsche", "Upcoming", "A philosophical poem on self-overcoming, the Übermensch, and eternal recurrence."],
  ["Existential Psychotherapy", "Irvin Yalom", "Upcoming", "Clinical engagement with the four ultimate concerns: death, freedom, isolation, and meaninglessness."],
  ["The Sickness Unto Death", "Søren Kierkegaard", "Upcoming", "Despair as the disease of the self and the path toward spiritual alignment."],
  ["Memories, Dreams, Reflections", "Carl Jung", "Upcoming", "An autobiographical journey into the interior landscape of the psyche."],
  ["The Varieties of Religious Experience", "William James", "Upcoming", "A pragmatic investigation into subjective personal religious experiences."],
  ["Being and Nothingness", "Jean-Paul Sartre", "Upcoming", "Phenomenological ontology detailing radical human freedom and bad faith."],
  ["The Meaning of Anxiety", "Rollo May", "Upcoming", "Distinguishing normal anxiety from neurotic anxiety in personal development."],
  ["The Ego and the Id", "Sigmund Freud", "Upcoming", "The structural model of the mind divided into Id, Ego, and Superego."],
  ["The Rebel", "Albert Camus", "Upcoming", "An essay on metaphysical and political revolution versus nihilistic violence."],
  ["On the Genealogy of Morals", "Friedrich Nietzsche", "Upcoming", "Tracing the historical origins of master and slave morality."],
  ["Man’s Search for Himself", "Rollo May", "Upcoming", "Finding personal identity and integrity in an age of insecurity."],
  ["The Undiscovered Self", "Carl Jung", "Upcoming", "The individual's psychological struggle against mass society and state authoritarianism."],
  ["Existentialism Is a Humanism", "Jean-Paul Sartre", "Upcoming", "A defense of existentialist thought against religious and Marxist critics."],
  ["Totem and Taboo", "Sigmund Freud", "Upcoming", "Applying psychoanalytic theory to anthropology and societal origin myths."],
  ["Love’s Executioner", "Irvin Yalom", "Upcoming", "Ten clinical tales revealing the underlying existential struggles within therapy."],
  ["Being and Time", "Martin Heidegger", "Upcoming", "An investigation into the fundamental nature of Being (Dasein) and temporality."],
  ["Modern Man in Search of a Soul", "Carl Jung", "Upcoming", "Essays addressing spiritual disorientation in modern secular society."],
  ["Psychology and Religion", "Carl Jung", "Upcoming", "Examining religious experience through empirical psychological investigation."],
  ["Crime and Punishment", "Fyodor Dostoevsky", "Upcoming", "Guilt, redemption, and the psychological destruction of the self-proclaimed extraordinary man."],
].map(([title, author, status, reviewExcerpt], index) => ({
  id: index + 1,
  title,
  author,
  coverImage: `/books/book-${index + 1}.jpg`,
  status: status as Book["status"],
  reviewExcerpt,
  fullReview: review(reviewExcerpt),
}));
