import React, { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import tradie_my_profile_2 from "../../assets/images/professional-tradie.jpg";
import * as Actions from "../../redux/auth/action";
import { useDispatch, useSelector } from "react-redux";
import NavigationLinks from "../../components/Tradie Name/Index";
import UploadProfile from "../../assets/icons/uploadProfile.svg";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Section_top_1 from "../../assets/icons/section-top-directory-before.svg";

toast.configure();

const Index = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    Get_Image_list_Action,
    Image_Upload_Action,
    Image_list_Delete_Action,
  } = Actions;
  const { businessUpdateres, imgUpdateres } = useSelector(
    (state) => state.auth
  );
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(Get_Image_list_Action());
    // console.log("from use effect");
  }, []);

  const fileToDataUri = (image) => {
    return new Promise((res) => {
      const reader = new FileReader();
      const { type, name, size } = image;
      reader.addEventListener("load", () => {
        res({
          base64: reader.result,
          name: name,
          type,
          size: size,
        });
      });
      reader.readAsDataURL(image);
    });
  };

  const handleImageChangeInput = async (event) => {
    const { target } = event;
    const file = [target.files[0]];
    // const newImagesPromises = [];
    // for (let i = 0; i < target.files.length; i++) {
    //   newImagesPromises.push(fileToDataUri(target.files[i]));
    // }
    // const newImages = await Promise.all(newImagesPromises);
    // http://3.109.98.222:3349/api/provider-upload-image

    dispatch(Image_Upload_Action(file));
  };

  useEffect(() => {
    if (businessUpdateres) {
      toast.success(businessUpdateres, {
        position: "bottom-left",
        autoClose: 2000,
        size: "small",
      });
      setTimeout(() => {
        history.push("/tradie-additional-services");
      }, 2000);
    }

    dispatch({ type: "BUSINESSS_DETAILS_UPDATE_SUCCESS", payloade: "" });
  }, [businessUpdateres]);
  return (
    <div>
      <Header />

      {/* <!-- My Profile--> */}
      <section className="directory-top-section section-top--tradie-my-profile">
      <div className="section-top__before">
          <img src={Section_top_1} alt="" />
        </div>
        <h2 className="section-top__title">
          My <span>Profile</span>
        </h2>
      </section>

      <section className="section section--tradie-my-profile">
        <div className="tradie-my-profile">
          <NavigationLinks />
          <form action="#" className="tradie-my-profile__form">
            <h4>Upload photos of your work</h4>

            <div id="drop-zone">
              <div className="icon">
                <div class="image-upload">
                  <label for="file-input">
                    <svg
                      width="101"
                      height="87"
                      viewBox="0 0 101 87"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <rect width="101" height="87" fill="url(#pattern0)" />
                      <defs>
                        <pattern
                          id="pattern0"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#image0_53:2133"
                            transform="translate(0 -0.0804598) scale(0.00195312 0.00226742)"
                          />
                        </pattern>
                        <image
                          id="image0_53:2133"
                          width="512"
                          height="491"
                          xlinkHref="data:image/png;base64,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"
                        />
                      </defs>
                    </svg>
                  </label>

                  <input
                    id="file-input"
                    type="file"
                    name="myImage"
                    multiple="multiple"
                    onChange={(e) => {
                      handleImageChangeInput(e);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              {/* <input type="submit" className="btn-primary" value="Save" /> */}
            </div>
          </form>
        </div>
      </section>
      {/* <!-- Are you a Professional Tradie? --> */}
      {/* {userData.access === "provider" ? (
        ""
      ) : ( */}
      <section className="section section--left">
        <div className="professional-tradie">
          <div className="professional-tradie__description">
            <h3 className="professional-tradie__title">
              Are you a Professional Tradie?
            </h3>
            <p>
              If you would like to be part of our Tradie community and are ready
              to meet new clients today please continue so we can welcome you
              onboard.
            </p>
            <Link to="/about-us" className="btn-primary">
              Learn More
            </Link>
          </div>
          <div className="professional-tradie__image">
            <img src={tradie_my_profile_2} alt="" />
          </div>
        </div>
      </section>
      {/* )} */}
      <Footer />
    </div>
  );
};

export default Index;
