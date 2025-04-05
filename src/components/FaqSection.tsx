
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function FaqSection() {
  const faqs = [
    {
      question: 'מה העלות של ייעוץ משפטי ראשוני?',
      answer: 'ייעוץ משפטי ראשוני במשרדנו כרוך בתשלום סמלי של 300 ש"ח + מע"מ. פגישה זו נמשכת כשעה ובמהלכה ניתן לקבל הערכה ראשונית של המקרה והכוונה משפטית.'
    },
    {
      question: 'כמה זמן נמשך בדרך כלל הליך משפטי?',
      answer: 'משך ההליך המשפטי תלוי בסוג התיק ומורכבותו. תיקים פשוטים יחסית יכולים להימשך מספר חודשים, בעוד תיקים מורכבים יותר עשויים להימשך שנה או יותר. במהלך הפגישה הראשונית ניתן הערכה מדויקת יותר בהתאם לנסיבות המקרה הספציפי.'
    },
    {
      question: 'האם אתם מספקים שירותי משפט בכל הארץ?',
      answer: 'כן, משרדנו מעניק שירותים משפטיים בכל הארץ. אנו מייצגים בבתי משפט בכל המחוזות ומטפלים בתיקים מצפון ועד דרום. במקרים מסוימים ניתן לקיים פגישות מקוונות לנוחות לקוחות המתגוררים רחוק ממשרדנו.'
    },
    {
      question: 'האם אפשר לקבל ייעוץ משפטי בשיחת טלפון?',
      answer: 'במקרים מסוימים, ניתן לקבל ייעוץ משפטי ראשוני בשיחת טלפון או בפגישת וידאו. עם זאת, לרוב אנו ממליצים על פגישה פרונטלית לפחות בתחילת ההתקשרות, על מנת להבין את המקרה לעומק ולתת ייעוץ אפקטיבי יותר.'
    },
    {
      question: 'איך מחושב שכר הטרחה עבור ייצוג משפטי?',
      answer: 'שכר הטרחה עבור ייצוג משפטי נקבע בהתאם למורכבות התיק, היקף העבודה הנדרשת, והסיכויים/סיכונים הכרוכים בו. אנו עובדים במספר מודלים: תשלום קבוע מראש, תשלום לפי שעות עבודה, או במקרים מסוימים - תשלום באחוזים מהסכום שיתקבל. התעריף המדויק נקבע במהלך הפגישה הראשונית ומעוגן בהסכם שכר טרחה.'
    },
    {
      question: 'האם אפשר לבטל הסכם שכבר נחתם?',
      answer: 'בישראל, ביטול הסכם לאחר חתימתו אפשרי במקרים מסוימים בלבד, כגון: פגמים בכריתת ההסכם (טעות, הטעיה, כפייה או עושק), הפרה יסודית של ההסכם על ידי הצד השני, או תנאים מפורשים בהסכם המאפשרים ביטולו. מומלץ להתייעץ עם עורך דין לבחינת האפשרויות הספציפיות למקרה שלכם.'
    }
  ];

  return (
    <section id="faq" className="section-wrapper">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">שאלות נפוצות</h2>
          <p className="section-subtitle">תשובות לשאלות שכיחות</p>
        </div>
        
        <div className="max-w-3xl mx-auto glass-card p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-law-dark text-right">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-law-gray text-right">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
