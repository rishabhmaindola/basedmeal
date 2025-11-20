const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const button = item.querySelector('button');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('svg');

    button.addEventListener('click', () => {
        const isHidden = content.classList.contains('hidden');

        faqItems.forEach(otherItem => {
            otherItem.querySelector('.faq-content').classList.add('hidden');
            otherItem.querySelector('svg').classList.remove('rotate-45');
            otherItem.querySelector('svg').classList.add('rotate-0');
        });

        if (isHidden) {
            content.classList.remove('hidden');
            icon.classList.remove('rotate-0');
            icon.classList.add('rotate-45');
        }
    });
});
