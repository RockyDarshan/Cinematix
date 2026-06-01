import { Client, Databases, Query, ID } from 'appwrite';
import authService from './appwrite/auth';

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    console.log('📌 updateSearchCount called:', { searchTerm, movie, user });

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
      Query.equal('userId', user.$id),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
        lastSearched: new Date(),
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        userId: user.$id,
        userName: user.name,
        userEmail: user.email,
        lastSearched: new Date(),
      });
    }
  } catch (error) {
    console.error('Error updating search count:', error);
    throw error;
  }
};

export const getTopSearches = async () => {
  try {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('userId', user.$id),
      Query.orderDesc('count'),
      Query.limit(6),
    ]);

    return result.documents;
  } catch (error) {
    console.error('Error fetching top searches:', error);
    return [];
  }
};

export const getUserSearchHistory = async (limit = 20) => {
  try {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('userId', user.$id),
      Query.orderDesc('lastSearched'),
      Query.limit(limit),
    ]);

    return result.documents;
  } catch (error) {
    console.error('Error fetching search history:', error);
    return [];
  }
};

export const clearUserSearchHistory = async () => {
  try {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('userId', user.$id),
    ]);

    const deletePromises = result.documents.map((doc) =>
      database.deleteDocument(DATABASE_ID, COLLECTION_ID, doc.$id)
    );
    await Promise.all(deletePromises);

    return { success: true, deletedCount: result.documents.length };
  } catch (error) {
    console.error('Error clearing search history:', error);
    throw error;
  }
};
