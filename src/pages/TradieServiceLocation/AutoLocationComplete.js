import React, { useState, useEffect } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import axios from "axios"
import { useHistory } from "react-router-dom";
import { ReactComponent as LocationIcon } from "../../assets/icons/locationSvg.svg";
import LocationIocn  from "../../assets/images/location-icon.svg";
import tradie_service_location_2 from "../../assets/icons/map-location.svg";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../redux/auth/action";
import Geolocation from "react-geolocation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

let addrees = "";
const AutoCompleteSearch = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { Get_User_Address_Action, Get_Provider_Address_Action } = Actions;

  const { tradiaServiceLocation, businessUpdateres } = useSelector(
    (state) => state.auth
  );
  const [currentLocation, setCurrentLocation] = useState(false);
  const [detectButton, setDetectButton] = useState();
  const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [status, setStatus] = useState(null);

  const [fulladdress,SetFulladdress] = useState([])
  const [searchQuery, setSeacrhQuery] = useState("");

  const [searchFormData, setSearchFormData] = useState({
    locationAdress: "",
    latitude: "",
    longitude: "",
  });

  const { locationAdress, latitude, longitude } = searchFormData;

  const handleChange = (value) => {
    setSeacrhQuery(value);
  };
  const handleSelect = (searchQuery) => {
    setSeacrhQuery(searchQuery);

    geocodeByAddress(searchQuery)
      .then((results) => {
        addrees = results[0].formatted_address;

        return getLatLng(results[0]);
      })
      .then((latLng) => {
        setSearchFormData({
          latitude: latLng.lat,
          longitude: latLng.lng,
          locationAdress: addrees,
        });
      })
      .catch((error) => console.error("Error", error));
  };

  useEffect(() => {
    dispatch(Get_User_Address_Action());
  }, []);

  const splitAddress = locationAdress.split(",");

  const submitServiceLocation = (e) => {
    e.preventDefault();
    if(fulladdress.length>0) 
    {
  
    let a = fulladdress.length-3 ; 
      let data = fulladdress[a]
    
      const serviceData = {
        address: data.formatted_address,
        city: data.address_components[0].long_name,
        country: data.address_components[2].long_name,
        state: data.address_components[1].long_name,
        latitude: lat,
        location_name: "home",
        longitude: lng,
        online: 1,
        role: "provider",
        
      }
      // console.log("fulladdress",serviceData)
      dispatch(Get_Provider_Address_Action(serviceData));

      setTimeout(() => {
        dispatch(Get_User_Address_Action());
      }, 300);
      
    }
   else if (splitAddress.length === 2) {
      const serviceData = {
        address: locationAdress,
        city: splitAddress[splitAddress.length - 2],
        country: splitAddress[splitAddress.length - 1],
        state: splitAddress[splitAddress.length - 2],
        latitude: latitude,
        location_name: "home",
        longitude: longitude,
        online: 1,
        role: "provider",
      };
      dispatch(Get_Provider_Address_Action(serviceData));

      setTimeout(() => {
        dispatch(Get_User_Address_Action());
      }, 300);
    } else {
      const serviceData = {
        address: locationAdress,
        city: splitAddress[splitAddress.length - 3],
        country: splitAddress[splitAddress.length - 1],
        state: splitAddress[splitAddress.length - 2],
        latitude: latitude,
        location_name: "home",
        longitude: longitude,
        online: 1,
        role: "provider",
      };
      dispatch(Get_Provider_Address_Action(serviceData));
      setTimeout(() => {
        dispatch(Get_User_Address_Action());
      }, 300);
    }
  };

  useEffect(() => {
    if (businessUpdateres) {
      toast.success(businessUpdateres, {
        position: "bottom-left",
        autoClose: 2000,
        size: "small",
      });
      setTimeout(() => {
        history.push("/tradie-my-profile");
      }, 2000);
    }

    dispatch({ type: "BUSINESSS_DETAILS_UPDATE_SUCCESS", payloade: "" });
  }, [businessUpdateres]);

  const calllatelong = async (latt,lngg)=>{
    // console.log("HELLO" , latt,lngg)
    const url =
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latt},${lngg}&key=AIzaSyDT6N5TjyH0MjDRAcYLGuiL1otostkeYhs`
          const res = await axios.get(url);
          // console.log("res",res);
          SetFulladdress(res.data.results)
        
      }
    
    
      const getLocation = () => {
            if (!navigator.geolocation) {
              setStatus('Geolocation is not supported by your browser');
            } else {
              setStatus('Locating...');
              navigator.geolocation.getCurrentPosition((position) => {
                setStatus(null);
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
                calllatelong(position.coords.latitude,position.coords.longitude)
               
              }, () => {
                setStatus('Unable to retrieve your location');
              }); 
            
            }
            
          }
  return (
    <>
      <div className="input-group">
        <div className="">
          <div className="profile-search location-srch">
            <PlacesAutocomplete
              value={searchQuery}
              onChange={handleChange}
              onSelect={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: "Type to search",
                      className: "location-search-input",
                    })}
                    className="input-additional-service additional-service-information"
                  />
                  <div
                    className="autocomplete-search-dropDown"
                    style={{ marginTop: "30px" }}
                  >
                    {suggestions.map((suggestion, idx) => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: "#ffffff", cursor: "pointer" }
                        : {
                            backgroundColor: "#ffffff",
                            cursor: "pointer",
                          };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                          key={idx}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                            className="svg-and-location-additional"
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              // style,
                            })}
                          >
                            <LocationIcon
                              height="20px"
                              width="20px"
                              fill="grey"
                            />
                            <div className="location-input-result">
                              <p
                                className="autocomplete-search-items-additional"
                                // onClick={handleSelectTerm}
                              >
                                {suggestion.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          {/* <Geolocation
            render={({ getCurrentPosition, fetchingPosition, position }) => (
              <div>
                <button className="profile-btn " onClick={getCurrentPosition}>
                  <span>Detect Current Location</span>
                </button>
              
                <p>{position && position.coords.latitude}</p>
                <p>{position && position.coords.longitude}</p>
              </div>
            )}
          /> */}
          <button
            type="button"
            className="profile-btn detect-location-btn"
            onClick={ getLocation}
          >
            <img
            className="location-icon "
            src={LocationIocn}
            alt="icon"
            />
            Detect Current Location
          </button>
        </div>
      </div>
      <label className="m-b-1">Recent Location</label>
      <div className="input-group mb-1">
        <p className="  ">
          <img width="20" height="20" src={tradie_service_location_2} alt="" />
          {tradiaServiceLocation ? tradiaServiceLocation[0]?.address : ""}
        </p>
      </div>

      <div className="input-group btn">
        <input
          type="submit"
          className="btn-primary"
          onClick={(e) => {
            submitServiceLocation(e);
          }}
          value="Save"
        />
      </div>
    </>
  );
};
export default AutoCompleteSearch;
