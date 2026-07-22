import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export const categories = {
  codex: { name: 'Codex', label: 'OPENAI', index: '01', description: '把想法落实到文件、界面和真实工作流里的过程记录。', tone: 'coral' },
  claude: { name: 'Claude', label: 'ANTHROPIC', index: '02', description: '关于长上下文、写作、研究与协作思考的日常试验。', tone: 'blue' },
  reasonix: { name: 'Reasonix', label: 'KNOWLEDGE SYSTEM', index: '03', description: '把零散信息拆开、连接，再变成可执行判断的方法。', tone: 'lime' },
  workbuddy: { name: 'WorkBuddy', label: 'WORK COMPANION', index: '04', description: '围绕日常项目推进、沟通和复盘留下的实用小记。', tone: 'yellow' }
};

const contentRoot = path.join(process.cwd(), 'content');

const noteFromFile = (category, fileName) => {
  const source = fs.readFileSync(path.join(contentRoot, category, fileName), 'utf8');
  const { data, content } = matter(source);
  const slug = fileName.replace(/\.mdx$/, '');
  return {
    slug,
    category,
    title: data.title,
    summary: data.summary,
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
    readingTime: Math.max(1, Math.ceil(readingTime(content).minutes)),
    source
  };
};

export const getAllNotes = () => Object.keys(categories).flatMap(category => {
  const directory = path.join(contentRoot, category);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(file => file.endsWith('.mdx')).map(file => noteFromFile(category, file));
}).sort((a, b) => new Date(b.date) - new Date(a.date));

export const getNotesByCategory = category => getAllNotes().filter(note => note.category === category);

export const getNoteBySlug = slug => getAllNotes().find(note => note.slug === slug);
