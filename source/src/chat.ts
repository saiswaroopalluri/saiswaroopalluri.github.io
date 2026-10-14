import { ask, suggestions, type Reply } from './assistant';
import { loadModel, modelReady, semanticAsk } from './semantic';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');

export function initChat() {
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'chat-launch';
  launcher.innerHTML = '<span class="chat-avatar">SA</span> Ask me anything';
  launcher.setAttribute('aria-expanded', 'false');
  document.body.append(launcher);

  const panel = document.createElement('section');
  panel.className = 'chat-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Ask Sai Swaroop');
  panel.hidden = true;
  panel.innerHTML = `
    <header class="chat-head">
      <span class="chat-avatar">SA</span>
      <div><strong>Ask Sai</strong><small id="chat-status">Local model · answers only from my résumé</small></div>
      <button type="button" class="chat-close" aria-label="Close assistant">×</button>
    </header>
    <div class="chat-log" id="chat-log" role="log" aria-live="polite"></div>
    <div class="chat-chips" id="chat-chips"></div>
    <form class="chat-form" autocomplete="off">
      <input id="chat-input" type="text" placeholder="Ask about my work, stack, or experience…" aria-label="Your question" />
      <button type="submit" aria-label="Send question">↑</button>
    </form>`;
  document.body.append(panel);

  const log = panel.querySelector<HTMLDivElement>('#chat-log')!;
  const chips = panel.querySelector<HTMLDivElement>('#chat-chips')!;
  const input = panel.querySelector<HTMLInputElement>('#chat-input')!;
  const status = panel.querySelector<HTMLElement>('#chat-status')!;
  let busy = false;

  function bubble(html: string, role: 'me' | 'bot', label?: string) {
    const row = document.createElement('div');
    row.className = `chat-msg chat-${role}`;
    row.innerHTML = label ? `<span class="chat-label">${label}</span>${html}` : html;
    log.append(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function renderChips(items: string[]) {
    chips.innerHTML = items.map(item => `<button type="button">${item}</button>`).join('');
  }

  async function submit(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    busy = true;
    bubble(trimmed, 'me');
    chips.innerHTML = '';
    const thinking = bubble('<i class="chat-dots"><i></i><i></i><i></i></i>', 'bot');
    const started = performance.now();
    let reply: Reply | null = modelReady() ? await semanticAsk(trimmed) : null;
    if (!reply) reply = ask(trimmed);
    const wait = reduced.matches ? 0 : Math.max(0, 420 - (performance.now() - started));
    setTimeout(() => {
      thinking.remove();
      bubble(reply!.html, 'bot', reply!.confident ? undefined : reply!.label === 'No match' ? 'Not in my notes' : 'Closest match');
      renderChips(reply!.follow);
      busy = false;
      log.scrollTop = log.scrollHeight;
    }, wait);
  }

  function open() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('chat-open');
    if (!log.childElementCount) {
      bubble(`Hi — I'm a small assistant running <b>entirely in your browser</b>, answering only from Sai's résumé and project notes. Nothing is sent anywhere.<br><br>Ask me about his work, stack, releases, or certifications.`, 'bot');
      renderChips(suggestions().slice(0, 4));
      loadModel(state => {
        if (state === 'loading') status.textContent = 'Loading local model…';
        if (state === 'ready') status.textContent = 'Local model ready · runs in your browser';
        if (state === 'failed') status.textContent = 'Offline mode · keyword search';
      });
    }
    input.focus();
  }

  function close() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('chat-open');
    launcher.focus();
  }

  launcher.addEventListener('click', () => (panel.hidden ? open() : close()));
  panel.addEventListener('click', event => {
    if ((event.target as Element).closest('.chat-close')) close();
  });
  addEventListener('pointerdown', event => {
    if (panel.hidden) return;
    const target = event.target as Element;
    if (target.closest('.chat-panel') || target.closest('.chat-launch')) return;
    close();
  });
  panel.querySelector('form')!.addEventListener('submit', event => {
    event.preventDefault();
    submit(input.value);
    input.value = '';
  });
  chips.addEventListener('click', event => {
    const button = (event.target as Element).closest('button');
    if (button) submit(button.textContent ?? '');
  });
  addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) close();
  });

  return { open };
}
