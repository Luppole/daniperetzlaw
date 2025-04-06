
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EditableText } from '@/components/EditableText';

export function FaqSection() {
  const faqs = [
    {
      id: 'faq-1',
      question: 'מה העלות של ייעוץ משפטי ראשוני?',
      answer: 'ייעוץ משפטי ראשוני במשרדנו כרוך בתשלום סמלי של 300 ש"ח + מע"מ. פגישה זו נמשכת כשעה ובמהלכה ניתן לקבל הערכה ראשונית של המקרה והכוונה משפטית.'
    },
    {
      id: 'faq-2',
      question: 'כמה זמן נמשך בדרך כלל הליך משפטי?',
      answer: 'משך ההליך המשפטי תלוי בסוג התיק ומורכבותו. תיקים פשוטים יחסית יכולים להימשך מספר חודשים, בעוד תיקים מורכבים יותר עשויים להימשך שנה או יותר. במהלך הפגישה הראשונית ניתן הערכה מדויקת יותר בהתאם לנסיבות המקרה הספציפי.'
    },
    {
      id: 'faq-3',
      question: 'האם אתם מספקים שירותי משפט בכל הארץ?',
      answer: 'כן, משרדנו מעניק שירותים משפטיים בכל הארץ. אנו מייצגים בבתי משפט בכל המחוזות ומטפלים בתיקים מצפון ועד דרום. במקרים מסוימים ניתן לקיים פגישות מקוונות לנוחות לקוחות המתגוררים רחוק ממשרדנו.'
    },
    {
      id: 'faq-4',
      question: 'האם אפשר לקבל ייעוץ משפטי בשיחת טלפון?',
      answer: 'במקרים מסוימים, ניתן לקבל ייעוץ משפטי ראשוני בשיחת טלפון או בפגישת וידאו. עם זאת, לרוב אנו ממליצים על פגישה פרונטלית לפחות בתחילת ההתקשרות, על מנת להבין את המקרה לעומק ולתת ייעוץ אפקטיבי יותר.'
    },
    {
      id: 'faq-5',
      question: 'איך מחושב שכר הטרחה עבור ייצוג משפטי?',
      answer: 'שכר הטרחה עבור ייצוג משפטי נקבע בהתאם למורכבות התיק, היקף העבודה הנדרשת, והסיכויים/סיכונים הכרוכים בו. אנו עובדים במספר מודלים: תשלום קבוע מראש, תשלום לפי שעות עבודה, או במקרים מסוימים - תשלום באחוזים מהסכום שיתקבל. התעריף המדויק נקבע במהלך הפגישה הראשונית ומעוגן בהסכם שכר טרחה.'
    },
    {
      id: 'faq-6',
      question: 'האם אפשר לבטל הסכם שכבר נחתם?',
      answer: 'בישראל, ביטול הסכם לאחר חתימתו אפשרי במקרים מסוימים בלבד, כגון: פגמים בכריתת ההסכם (טעות, הטעיה, כפייה או עושק), הפרה יסודית של ההסכם על ידי הצד השני, או תנאים מפורשים בהסכם המאפשרים ביטולו. מומלץ להתייעץ עם עורך דין לבחינת האפשרויות הספציפיות למקרה שלכם.'
    }
  ];

  return (
    <section id="faq" className="section-wrapper">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title"><EditableText id="faq-title">שאלות נפוצות</EditableText></h2>
          <p className="section-subtitle"><EditableText id="faq-subtitle">תשובות לשאלות שכיחות</EditableText></p>
        </div>
        
        <div className="max-w-3xl mx-auto glass-card p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-lg font-medium text-law-dark text-right">
                  <EditableText id={`faq-q-${faq.id}`}>{faq.question}</EditableText>
                </AccordionTrigger>
                <AccordionContent className="text-law-gray text-right">
                  <EditableText id={`faq-a-${faq.id}`}>{faq.answer}</EditableText>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
