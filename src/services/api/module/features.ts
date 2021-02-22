import {
  CreatorApps,
  Feature,
  FeatureImage,
  Observation,
} from "../../../models";
import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { PagedResponse, SingleResponse } from "../types";

const featurePath = "/feature";
const featuresPath = "/features";

const featureImagePath = "/featureImage";

export const featuresModule = {
  async getFeatures(observationId: string | null, cursor: string | null) {
    const params = {
      observationId: observationId === null ? "null" : observationId,
      cursor,
    };
    const response: HttpResponse<
      PagedResponse<Observation>
    > = await baseApi.get(featuresPath, params);
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
  async postFeature(feature: Feature) {
    const params = {
      id: feature.id,
      creatorApp: feature.creatorApp,
      creatorId: feature.creatorId,
      observationId: feature.observationId,
      featureTypeId: feature.featureTypeId,
      quantity: feature.quantity,
      quantityUnits: feature.quantityUnits,
      estimatedWeightKg: feature.estimatedWeightKg,
      estimatedSizeM2: feature.estimatedSizeM2,
      estimatedVolumeM3: feature.estimatedVolumeM3,
      depthM: feature.depthM,
      isAbsence: feature.isAbsence,
      isCollected: feature.isCollected,
      comments: feature.comments,
    };
    const response: HttpResponse<SingleResponse<Feature>> = await baseApi.post(
      featurePath,
      params
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
  async postFeatureImage(featureImage: FeatureImage) {
    if (featureImage.url === undefined) return;

    const form = new FormData();
    form.append("id", featureImage.id);
    form.append(
      "creatorApp",
      featureImage.creatorApp || CreatorApps.DATA_COLLECTION_APP
    );
    form.append("featureId", featureImage.featureId);

    const imageData = {
      name: featureImage.id + "-featureImage.jpg",
      uri: featureImage.url,
      type: "image/jpg",
    };
    form.append("image", imageData);

    const response: HttpResponse<
      SingleResponse<FeatureImage>
    > = await baseApi.post(featureImagePath, form, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
