import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border py-5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neon-blue flex items-center justify-center">
              <Icon name="Zap" size={14} className="text-white" />
            </div>
            <span className="font-oswald font-bold tracking-wide">СТРАЙК<span className="text-neon-blue"> </span>СЕРВИС</span>
          </Link>
          <Link to="/" className="text-sm text-foreground/65 hover:text-foreground flex items-center gap-1.5">
            <Icon name="ArrowLeft" size={14} />
            На главную
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="section-tag mb-4">Документ</div>
        <h1 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black mb-8 leading-tight">
          СОГЛАСИЕ НА ОБРАБОТКУ<br />
          <span className="text-neon-blue">ПЕРСОНАЛЬНЫХ ДАННЫХ</span>
        </h1>

        <div className="prose prose-invert max-w-none space-y-5 text-foreground/80 text-sm sm:text-base leading-relaxed">
          <p>
            Настоящее Согласие на обработку персональных данных дано в соответствии с Федеральным законом
            от 27.07.2006 № 152-ФЗ «О персональных данных» (далее — Закон) с целью получения услуг и обратной
            связи на сайте «Страйк Сервис» (далее — Оператор).
          </p>

          <h2 className="font-oswald text-xl sm:text-2xl font-bold text-foreground mt-8 mb-3">1. Оператор</h2>
          <p>
            Оператором персональных данных является ООО «Страйк Сервис»,
            г. Тюмень, ул. Республики, д. 1, e-mail: info@techservice.ru, тел.: +7 (495) 123-45-67.
          </p>

          <h2 className="font-oswald text-xl sm:text-2xl font-bold text-foreground mt-8 mb-3">2. Перечень обрабатываемых данных</h2>
          <p>Пользователь, оставляя заявку на сайте, даёт согласие на обработку следующих персональных данных:</p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2"><span className="text-neon-green mt-1.5">•</span><span>фамилия, имя, отчество;</span></li>
            <li className="flex items-start gap-2"><span className="text-neon-green mt-1.5">•</span><span>номер контактного телефона;</span></li>
            <li className="flex items-start gap-2"><span className="text-neon-green mt-1.5">•</span><span>адрес электронной почты;</span></li>
            <li className="flex items-start gap-2"><span className="text-neon-green mt-1.5">•</span><span>адрес объекта выезда мастера (по необходимости);</span></li>
            <li className="flex items-start gap-2"><span className="text-neon-green mt-1.5">•</span><span>сведения, добровольно указанные в комментарии к заявке.</span></li>
          </ul>

          <h2 className="font-oswald text-xl sm:text-2xl font-bold text-foreground mt-8 mb-3">3. Цели обработки</h2>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2"><span className="text-neon-green mt-1.5">•</span><span>обработка заявок и обращений;</span></li>
            <li className="flex items-start gap-2"><span className="text-neon-green mt-1.5">•</span><span>оказание услуг по обслуживанию и монтажу климатической техники;</span></li>
            <li className="flex items-start gap-2"><span className="text-neon-green mt-1.5">•</span><span>информирование о статусе заявки и согласование выезда мастера;</span></li>
            <li className="flex items-start gap-2"><span className="text-neon-green mt-1.5">•</span><span>направление информации о сервисном обслуживании и акциях.</span></li>
          </ul>

          <h2 className="font-oswald text-xl sm:text-2xl font-bold text-foreground mt-8 mb-3">4. Перечень действий с персональными данными</h2>
          <p>
            Согласие распространяется на следующие действия с персональными данными:
            сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение),
            извлечение, использование, передачу (предоставление, доступ), блокирование, удаление, уничтожение —
            как с использованием средств автоматизации, так и без таковых.
          </p>

          <h2 className="font-oswald text-xl sm:text-2xl font-bold text-foreground mt-8 mb-3">5. Срок действия согласия</h2>
          <p>
            Согласие действует с момента его предоставления и до момента отзыва Пользователем.
            Согласие может быть отозвано в любой момент путём направления письменного заявления
            на электронный адрес info@techservice.ru.
          </p>

          <h2 className="font-oswald text-xl sm:text-2xl font-bold text-foreground mt-8 mb-3">6. Безопасность</h2>
          <p>
            Оператор принимает необходимые правовые, организационные и технические меры для защиты
            персональных данных от неправомерного или случайного доступа, уничтожения, изменения,
            блокирования, копирования, предоставления и распространения.
          </p>

          <p className="text-foreground/60 text-xs sm:text-sm mt-10">
            Подтверждая отправку формы на сайте, Пользователь подтверждает, что ознакомлен с настоящим
            Согласием и принимает его условия в полном объёме.
          </p>
        </div>
      </main>

      <footer className="border-t border-border py-8 mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-xs text-foreground/45">
          © 2026 Страйк Сервис. Все права защищены.
        </div>
      </footer>
    </div>
  );
}
