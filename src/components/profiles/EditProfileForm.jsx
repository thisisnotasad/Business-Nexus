import { useState } from "react";
import api from "../../utils/api";
import Button from "../common/Button";
import Input from "../common/Input";


function EditProfileForm({ user, onUpdate }) {
  const [bio, setBio] = useState(user.bio || "");
  const [interests, setInterests] = useState(user.interests?.join(", ") || "");
  const [startupName, setStartupName] = useState(user.startupName || "");
  const [startupDescription, setStartupDescription] = useState(user.startupDescription || "");
  const [fundingNeed, setFundingNeed] = useState(user.fundingNeed || "");
  const [pitchDeck, setPitchDeck] = useState(user.pitchDeck || "");
  const [portfolio, setPortfolio] = useState(user.portfolio?.join(", ") || "");
  const [location, setLocation] = useState(user.location || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [linkedin, setLinkedin] = useState(user.socialLinks?.linkedin || "");
  const [twitter, setTwitter] = useState(user.socialLinks?.twitter || "");
  const [website, setWebsite] = useState(user.socialLinks?.website || "");
  const [experience, setExperience] = useState(user.experience || "");
  const [industry, setIndustry] = useState(user.industry || "");
  const [stage, setStage] = useState(user.stage || "");
  const [traction, setTraction] = useState(user.traction || "");
  const [teamSize, setTeamSize] = useState(user.teamSize || "");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (bio.length > 500) newErrors.bio = "Bio must be 500 characters or less";
    if (fundingNeed && isNaN(fundingNeed)) newErrors.fundingNeed = "Funding need must be a number";
    if (teamSize && isNaN(teamSize)) newErrors.teamSize = "Team size must be a number";
    if (linkedin && !linkedin.startsWith("https://linkedin.com")) newErrors.linkedin = "Invalid LinkedIn URL";
    if (twitter && !twitter.startsWith("https://twitter.com")) newErrors.twitter = "Invalid Twitter URL";
    if (website && !website.startsWith("https://")) newErrors.website = "Invalid website URL";
    if (avatar && !avatar.startsWith("https://")) newErrors.avatar = "Invalid avatar URL";
    if (user.role === "entrepreneur" && stage && !["Pre-Seed", "Seed", "Series A", "Series B"].includes(stage)) {
      newErrors.stage = "Please select a valid stage";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updatedData = {
        ...user,
        bio,
        interests: interests.split(",").map((i) => i.trim()).filter((i) => i),
        location,
        avatar,
        socialLinks: { linkedin, twitter, website },
        experience
      };

      if (user.role === "entrepreneur") {
        updatedData.startupName = startupName;
        updatedData.startupDescription = startupDescription;
        updatedData.fundingNeed = Number(fundingNeed) || null;
        updatedData.pitchDeck = pitchDeck;
        updatedData.industry = industry;
        updatedData.stage = stage || null;
        updatedData.traction = traction;
        updatedData.teamSize = Number(teamSize) || null;
      } else {
        updatedData.portfolio = portfolio.split(",").map((p) => p.trim()).filter((p) => p);
      }

      console.log("Updating profile:", updatedData);
      await api.put(`/users/${user.id}`, updatedData);
      onUpdate();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      setErrors({ form: "Failed to update profile: " + (err.response?.data?.error || err.message) });
    }
  };

  return (
    <div className="p-4 bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl animate__fadeIn">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h3>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-gray-600 mb-1">Bio</label>
          <Input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Update bio"
            className="w-full"
          />
          {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Interests (comma-separated)</label>
          <Input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Interests"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Location</label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Avatar URL</label>
          <Input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Avatar URL"
            className="w-full"
          />
          {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}
        </div>
        <div>
          <label className="block text-gray-600 mb-1">LinkedIn</label>
          <Input
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="LinkedIn URL"
            className="w-full"
          />
          {errors.linkedin && <p className="text-red-500 text-sm">{errors.linkedin}</p>}
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Twitter</label>
          <Input
            type="text"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="Twitter URL"
            className="w-full"
          />
          {errors.twitter && <p className="text-red-500 text-sm">{errors.twitter}</p>}
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Website</label>
          <Input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website URL"
            className="w-full"
          />
          {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Experience</label>
          <Input
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Experience"
            className="w-full"
          />
        </div>
        {user.role === "entrepreneur" && (
          <>
            <div>
              <label className="block text-gray-600 mb-1">Startup Name</label>
              <Input
                type="text"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                placeholder="Startup Name"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Startup Description</label>
              <Input
                type="text"
                value={startupDescription}
                onChange={(e) => setStartupDescription(e.target.value)}
                placeholder="Startup Description"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Funding Need ($)</label>
              <Input
                type="number"
                value={fundingNeed}
                onChange={(e) => setFundingNeed(e.target.value)}
                placeholder="Funding Need"
                className="w-full"
              />
              {errors.fundingNeed && <p className="text-red-500 text-sm">{errors.fundingNeed}</p>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Pitch Deck URL</label>
              <Input
                type="text"
                value={pitchDeck}
                onChange={(e) => setPitchDeck(e.target.value)}
                placeholder="Pitch Deck URL"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Industry</label>
              <Input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Industry"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Stage</option>
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
              </select>
              {errors.stage && <p className="text-red-500 text-sm">{errors.stage}</p>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Traction</label>
              <Input
                type="text"
                value={traction}
                onChange={(e) => setTraction(e.target.value)}
                placeholder="Traction"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Team Size</label>
              <Input
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="Team Size"
                className="w-full"
              />
              {errors.teamSize && <p className="text-red-500 text-sm">{errors.teamSize}</p>}
            </div>
          </>
        )}
        {user.role === "investor" && (
          <div>
            <label className="block text-gray-600 mb-1">Portfolio (comma-separated)</label>
            <Input
              type="text"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="Portfolio"
              className="w-full"
            />
          </div>
        )}
        {errors.form && <p className="text-red-500 text-sm col-span-2">{errors.form}</p>}
        <div className="col-span-2 flex gap-4">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-transform hover:scale-105 shadow-md"
          >
            Save Profile
          </Button>
          <Button
            type="button"
            onClick={() => onUpdate()}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-transform hover:scale-105 shadow-md"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;