import React, { useState } from "react";
import styles from "./Settings.module.scss";

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: "Иван",
    lastName: "Иванов",
    email: "ivan@example.com",
    age: "25",
    city: "Москва",
    country: "Россия",
    profession: "Разработчик",
    favoriteAlcohol: "Вино",
    hobbies: "Программирование",
    about: "Люблю кодить.",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.settingsContainer}>
      <h1>Мои настройки</h1>
      <div className={styles.section}>
        {Object.entries({ firstName: "Имя", lastName: "Фамилия", email: "Email" }).map(([key, label]) => (
          <div key={key} className={styles.inputGroup}>
            <label>{label}</label>
            <input type="text" name={key} value={formData[key as keyof typeof formData]} onChange={handleChange} />
            <button>Подтвердить</button>
          </div>
        ))}
      </div>
      <h2>Дополнительная информация</h2>
      {Object.entries({ age: "Возраст", city: "Город", country: "Страна" }).map(([key, label]) => (
        <div key={key} className={styles.inputGroup}>
          <label>{label}</label>
          <select name={key} value={formData[key as keyof typeof formData]} onChange={handleChange}>
            {["18", "25", "30", "40"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}
      {Object.entries({ profession: "Профессия", favoriteAlcohol: "Любимый алкоголь", hobbies: "Хобби", about: "Побольше о себе" }).map(([key, label]) => (
        <div key={key} className={styles.inputGroup}>
          <label>{label}</label>
          <input type="text" name={key} value={formData[key as keyof typeof formData]} onChange={handleChange} />
        </div>
      ))}
      <h2>Пароль</h2>
      <p>Для того чтобы поменять пароль, нужно указать старый пароль</p>
      <div className={styles.inputGroup}>
        <label>Старый пароль</label>
        <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
        <a href="#">Забыли пароль?</a>
      </div>
      <div className={styles.inputGroup}>
        <label>Новый пароль</label>
        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
      </div>
      <div className={styles.inputGroup}>
        <label>Новый пароль снова</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
      </div>
      <button className={styles.submitButton}>Изменить пароль</button>
    </div>
  );
};

export default Settings;
