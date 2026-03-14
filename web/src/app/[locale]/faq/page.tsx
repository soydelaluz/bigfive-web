'use client';
import { title } from '@/components/primitives';
import { Accordion, AccordionItem } from '@nextui-org/accordion';

export default function FaqPage() {
  const faq = [
    {
      question: 'I got an error on this website',
      answer:
        'Please let us know if you find any errors.'
    },
    {
      question: 'Can I use the code for this website for Commercial Purposes?',
      answer: 'Yes, this project is licensed under the MIT license.'
    },
    {
      question: 'Can I use the questions for Commercial Purposes?',
      answer:
        'Yes, the questions and translations are licensed under the MIT license.'
    },
    {
      question: 'How do I print my test results?',
      answer:
        'Try to print the results-page from your browser or save it as a PDF-document and print that instead.'
    },
    {
      question:
        'Where can I find more information about the questions and the evaluation?',
      answer: 'See the IPIP Website for more information.'
    },
    {
      question: 'Where can I find the questions?',
      answer:
        'All questions and translations are based on public domain data.'
    }
  ];
  return (
    <div>
      <h1 className={title()}>Frequently asked questions.</h1>
      <Accordion className='mt-10'>
        {faq.map((item, index) => (
          <AccordionItem
            key={index}
            textValue={item.question}
            title={
              <span className='text-foreground text-large font-medium'>
                {item.question}
              </span>
            }
          >
            <div className='py-2 pt-0 pb-6 text-base text-default-500'>
              {item.answer}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
