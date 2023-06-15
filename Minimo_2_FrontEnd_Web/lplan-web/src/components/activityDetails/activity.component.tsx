import React, { useEffect, useState } from "react";
import { ActivityEntity } from "../../models/activity.model";
import { useTranslation } from "react-i18next";
import "./activity.component.css"
import { UserService } from "../../services/user.service";
import { User } from "../../models/user.model";
import { Link } from "react-router-dom";
import { RatingsService } from "../../services/ratings.service";
import { RatingsEntity } from "../../models/ratings.model";

interface ActivityDetailsModalProps {
  activity: ActivityEntity;
  onClose: () => void;
  onAddToActivity: (isJoining: boolean) => void;
  userId: string;
}

console.log("(1) Entro al Modal.");

const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({ activity, onClose, onAddToActivity, userId}) => {
    const { t } = useTranslation();
    const [participants, setParticipants] = useState(activity.participantsActivity || []);
    const [isCurrentUserParticipant, setIsCurrentUserParticipant] = useState(participants.includes(userId));
    const [isCreatorOfActivity, setIsCreatorOfActivity] = useState(activity.creatorActivity.includes(userId));
    const [creatorUser, setCreatorUser] = useState<User | null>(null);
    const [creatorAppName, setCreatorAppName] = useState<string>("");

  useEffect(() => {
    const fetchCreatorAppName = async (uuid: string) => {
      try {
        const response = await UserService.getPerson(uuid);
        const user = response.data;
        setCreatorUser(user);
        setCreatorAppName(user.appUser || "");
      } catch (error) {
        console.log(error);
      }
    };
    fetchCreatorAppName(activity.creatorActivity);
    ratingsMechanism();
  }, [activity.creatorActivity]);
    
  const handleAddToActivity = (isJoining: boolean) => {
    setIsCurrentUserParticipant(!isCurrentUserParticipant);
    onAddToActivity(isJoining);
  };

  const showJoinButton = !isCreatorOfActivity;

  const stars = Array.from(document.querySelectorAll('.stars_for_rating span[data-star]')) as HTMLElement[];

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const selectedStar = star.dataset.star;

      // Actualiza las estrellas anteriores a la seleccionada
      for (let i = 1; i <= parseInt(selectedStar!); i++) {
        const starElement = document.querySelector(`.stars_for_rating span[data-star="${i}"]`) as HTMLElement;
        if (starElement) {
          starElement.textContent = '★';
        }
      }

      // Actualiza las estrellas posteriores a la seleccionada
      for (let i = parseInt(selectedStar!) + 1; i <= 5; i++) {
        const starElement = document.querySelector(`.stars_for_rating span[data-star="${i}"]`) as HTMLElement;
        if (starElement) {
          starElement.textContent = '☆';
        }
      }
    });
  });

  //  - - - - - Mínimo 2 (by Marc) - - - - - 

  const [allRatings, setAllRatings] = useState<RatingsEntity | null>(null);
  const [ratingAverage, setRatingAverage] = useState<RatingsEntity | null>(null);

  const ratingsMechanism = async () => {
    try {
      const response = await RatingsService.getAllRatings();
      const listAllRatings = response.data;
      setAllRatings(listAllRatings);
  
      if (activity) {
        const activityId = activity.uuid;
  
        // Busco aquí si esta actividad ya ha sido votada antes por alguien ...
        const activityRating = listAllRatings.find(
          (rating: RatingsEntity) => rating.idRatedObject === activityId && rating.ratingType === "activities"
        );
  
        if (activityRating) {
          setRatingAverage(activityRating.ratingAverage);
          const raters = activityRating.idRaters || [];
          console.log("Average Rating: ", ratingAverage);
          console.log("ID of the Raters: ", raters);
          // DIFERENCIAR SI YA HAS VOTADO O NO.
        } else {
          console.log("There's no rating for this activity: ", activityId);
          // CREAR (POST) UN RATING.
        }
      } else {
        console.log("No activity found.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //  - - - - - Mínimo 2 (by Marc) - - - - - 

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{t("ActivityDetails")}</h2>
        <p>{t("Name")}: {activity.nameActivity}</p>
        <p>{t("Date")}: {new Date(activity.dateActivity).toISOString().substr(0, 10)}</p>
        <p>{t("Description")}: {activity.descriptionActivity}</p>
        {creatorUser && (
          <Link to={`/user/${creatorUser.uuid}`} className="user-link">
            <div className="post__header">
              <img className="post__profile-img" src={`${creatorUser.photoUser}`} alt="Profile"/>
                <div className="post__info">
                  <p className="post__username_header">{t("Creator")}: {creatorAppName}</p>
                </div>
            </div>
          </Link>
          )
        }

        <h2>Valoració</h2>
        <h2 className="stars_amount">{ratingAverage ? `☆ ${ratingAverage}` : `Not Rated`}</h2>
        <h1 className="stars_for_rating">
          <span data-star="1">☆</span>
          <span data-star="2">☆</span>
          <span data-star="3">☆</span>
          <span data-star="4">☆</span>
          <span data-star="5">☆</span>
        </h1>
        <button className="rate_button" onClick={onClose}>Add Rating</button>


        <p>Participantes: {activity.participantsActivity?.join(", ")}</p>
        <button onClick={onClose}>
          {t("Close")}
        </button>
        {showJoinButton && (
          <button onClick={() => handleAddToActivity(!isCurrentUserParticipant)}>
            {isCurrentUserParticipant ? "Leave Activity" : "Join Activity"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityDetailsModal;
