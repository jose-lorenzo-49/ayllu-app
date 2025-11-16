-- Insertar usuarios demo
INSERT INTO users (name, username, email, faculty, year, bio, avatar, location) VALUES
('María Castro', 'maria_unmsm', 'maria@unmsm.edu.pe', 'Medicina', '5to año', 'Futuro médico cirujano. Amante del café ☕', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', 'Lima, Perú'),
('Carlos Mendoza', 'carlos_dev', 'carlos@unmsm.edu.pe', 'Ingeniería de Sistemas', '4to año', 'Full-stack developer | Hackathons', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', 'Lima, Perú'),
('Ana Flores', 'ana_letras', 'ana@unmsm.edu.pe', 'Letras', '2do año', 'Amo la literatura latinoamericana 📚', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', 'Lima, Perú'),
('Diego Ramos', 'diego_derecho', 'diego@unmsm.edu.pe', 'Derecho', '5to año', 'Debate | Derechos Humanos | Campeón nacional', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', 'Lima, Perú');

-- Insertar posts demo
INSERT INTO posts (user_id, content) VALUES
((SELECT id FROM users WHERE username = 'maria_unmsm'), '¡Acabo de terminar mi práctica en el Hospital Dos de Mayo! La experiencia fue increíble. San Marcos nos prepara para la realidad 💪'),
((SELECT id FROM users WHERE username = 'carlos_dev'), '¿Alguien para el hackathon del viernes? Necesito un equipo para desarrollar una app de delivery para la ciudad universitaria 🚀'),
((SELECT id FROM users WHERE username = 'ana_letras'), 'Nueva cafetería en el pabellón de Letras ☕ Los precios son accesibles y el café es buenísimo. Recomendado para estudiar'),
((SELECT id FROM users WHERE username = 'diego_derecho'), 'Ganamos el debate nacional! 🏆 Representando a San Marcos con orgullo. El tema fue sobre reforma judicial.');

-- Insertar algunos likes demo
INSERT INTO likes (user_id, post_id) VALUES
((SELECT id FROM users WHERE username = 'carlos_dev'), (SELECT id FROM posts WHERE content LIKE '%Hospital Dos de Mayo%')),
((SELECT id FROM users WHERE username = 'ana_letras'), (SELECT id FROM posts WHERE content LIKE '%Hospital Dos de Mayo%')),
((SELECT id FROM users WHERE username = 'maria_unmsm'), (SELECT id FROM posts WHERE content LIKE '%hackathon%'));

-- Insertar comentarios demo
INSERT INTO comments (user_id, post_id, text) VALUES
((SELECT id FROM users WHERE username = 'carlos_dev'), (SELECT id FROM posts WHERE content LIKE '%Hospital Dos de Mayo%'), '¡Eres una crack María! Medicina es lo tuyo 👏'),
((SELECT id FROM users WHERE username = 'ana_letras'), (SELECT id FROM posts WHERE content LIKE '%hackathon%'), 'Me apunto! Necesito aprender más de tech 💻');